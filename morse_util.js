import { fromByteArray } from 'base64-js';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { createAudioPlayer } from 'expo-audio';

const MORSE = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.',
    F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---',
    P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--',
    Z: '--..', ' ': '/', Ä: '.-.-', Ö: '---.', Ü: '..--',
    1: '.----.', 2: '..---', 3: '...--', 4: '....-', 5: '.....',
    6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----' 
};

const DID_LENGTH = 0.1; // 100 ms for a dit
const DAH_LENGTH = DID_LENGTH * 3; // 300 ms for a dah
const LETTER_GAP_LENGTH = DID_LENGTH * 3; // 300 ms for a letter gap
const WORD_GAP_LENGTH = DID_LENGTH * 7; // 700 ms for a word gap
const SAMPLE_RATE = 44100; // Standard sample rate for audio
const FREQUENCY = 440; // Frequency for the tone (A4)
const VOLUME = 1; // Volume of the tone
const THRESHOLD = 0.2; // Threshold for detecting sound in PCM data
const NUMBER_OF_CHANNELS = 1; // Mono audio

const INVERSE_MORSE = Object.fromEntries(
    Object.entries(MORSE).map(([k, v]) => [v, k])
);

export function textToMorse(text) {
    return text.toUpperCase().split('').map(c => MORSE[c] || '').join(' ');
}

function generateTone(frequency, duration, sampleRate = SAMPLE_RATE, volume = VOLUME) {
    const length = sampleRate * duration;
    const buffer = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        buffer[i] = volume * Math.sin(2 * Math.PI * frequency * (i / sampleRate));
    }
    return buffer;
}

function generateSilence(duration, sampleRate = SAMPLE_RATE) {
    return new Float32Array(sampleRate * duration);
}

function morseToPCM(morse, frequency = FREQUENCY) {
    const sampleRate = SAMPLE_RATE;
    let result = new Float32Array();

    for (const symbol of morse) {
        let isTone = false;
        let symbolTone = null;

        if (symbol === '.') {
            console.log("Generating tone for dit");
            symbolTone = generateTone(frequency, DID_LENGTH);
            isTone = true;
        } else if (symbol === '-') {
            console.log("Generating tone for dah");
            symbolTone = generateTone(frequency, DAH_LENGTH);
            isTone = true;
        } else if (symbol === '/') {
            console.log("Generating silence for space between words");
            symbolTone = generateSilence(WORD_GAP_LENGTH);
        } else if (symbol === ' ') {
            console.log("Generating silence for space between letters");
            symbolTone = generateSilence(LETTER_GAP_LENGTH);
        } else {
            console.warn("Unrecognized symbol in Morse code:", symbol);
            continue; // Skip unrecognized symbols
        }

        const newResult = new Float32Array(result.length + symbolTone.length);
        newResult.set(result);
        newResult.set(symbolTone, result.length);
        result = newResult;
        if (isTone) {
            const gap = generateSilence(DID_LENGTH);
            const newResult = new Float32Array(result.length + gap.length);
            newResult.set(result);
            newResult.set(gap, result.length);
            result = newResult;
        }
    }
    // console.log(result);
    return result;
}

function encodeWAV(float32Data, sampleRate = SAMPLE_RATE, numChannels = NUMBER_OF_CHANNELS) {
    const bytesPerSample = 4; // 32-bit float = 4 bytes
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = float32Data.length * bytesPerSample;
    const fmtChunkSize = 16;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);

    let offset = 0;

    function writeString(str) {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset++, str.charCodeAt(i));
        }
    }

    // RIFF header
    writeString('RIFF');
    view.setUint32(offset, totalSize - 8, true); offset += 4;
    writeString('WAVE');

    // fmt chunk
    writeString('fmt ');
    view.setUint32(offset, fmtChunkSize, true); offset += 4;
    view.setUint16(offset, 3, true); offset += 2; // 3 = IEEE float
    view.setUint16(offset, numChannels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, byteRate, true); offset += 4;
    view.setUint16(offset, blockAlign, true); offset += 2;
    view.setUint16(offset, 32, true); offset += 2; // bitsPerSample

    // data chunk
    writeString('data');
    view.setUint32(offset, dataSize, true); offset += 4;

    // Write PCM float32 samples
    for (let i = 0; i < float32Data.length; i++) {
        view.setFloat32(offset, float32Data[i], true);
        offset += 4;
    }

    return new Uint8Array(buffer);
}
// ***************************+++++++++++*********************************
async function readWavPCM(uri) {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const buffer = decode(base64);
    const view = new DataView(buffer);

    // WAV header info
    const sampleRate = view.getUint32(24, true);
    const bitsPerSample = view.getUint16(34, true);
    const isFloat = view.getUint16(20, true) === 3;
    const channels = view.getUint16(22, true);
    const dataOffset = 44;

    const samples = (buffer.byteLength - dataOffset) / (bitsPerSample / 8);

    let pcm;
    if (bitsPerSample === 16 && !isFloat) {
        pcm = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const offset = dataOffset + i * 2;
            pcm[i] = view.getInt16(offset, true) / 32768;
        }
    } else if (bitsPerSample === 32 && isFloat) {
        pcm = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const offset = dataOffset + i * 4;
            pcm[i] = view.getFloat32(offset, true);
        }
    } else {
        throw new Error(`Unsupported WAV format: ${bitsPerSample} bits, float: ${isFloat}`);
    }

    return { pcm, sampleRate };
}

function normalizeToPeak(samples) {
    // find the maximum absolute value in the samples
    let maxAmplitude = 0;
    for (let i = 0; i < samples.length; i++) {
        const absVal = Math.abs(samples[i]);
        if (absVal > maxAmplitude) maxAmplitude = absVal;
    }
    console.log("Maximum amplitude found:", maxAmplitude);

    // if the maximum amplitude is 0, return the original samples
    if (maxAmplitude === 0) {
        return Float32Array.from(samples);
    }

    // calculate the gain factor to normalize to 1.0
    const gain = 1.0 / maxAmplitude;
    console.log("Normalization gain factor:", gain);

    // gain the samples and ensure they are within the range [-1.0, 1.0]
    const normalized = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
        let s = samples[i] * gain;
        // clamp the value to the range [-1.0, 1.0]
        if (s > 1.0) s = 1.0;
        else if (s < -1.0) s = -1.0;
        normalized[i] = s;
    }

    return normalized;
}

function pcmToMorse(pcm, sampleRate, threshold = THRESHOLD, ditLength = DID_LENGTH) {
    const dit = Math.floor(ditLength * sampleRate);
    const result = [];
    const blocks = [];

    console.log("PCM Length:", pcm.length, "Sample Rate:", sampleRate, "Dit Length:", ditLength, "Dit Size:", dit);
    // Go over all Blocks and determine if they are above the threshold (sound)
    for (let i = 0; i < pcm.length; i = i + dit + 1) {
        const window = pcm.slice(i, i + dit);
        const energy = window.reduce((sum, v) => sum + Math.abs(v), 0) / dit;
        console.log("Block " + i / dit + " Energy: " + energy);
        blocks.push(energy > threshold ? true : false);
    }

    console.log("Blocks detected:", blocks.length, "with threshold:", threshold);
    let ditCounter = 1;
    let lastDitWasTone = blocks[0];

    // Now go over the blocks and determine the morse code symbols
    for (let i = 1; i < blocks.length; i++) {
        console.log("Block", i, "is", blocks[i] ? "tone" : "silence", "with counter:", ditCounter, "last was tone:", lastDitWasTone);
        // same state as before, f.e. no tone -> no tone
        if (lastDitWasTone && blocks[i] || !lastDitWasTone && !blocks[i]) {
            ditCounter++;
            continue;
        }

        if (lastDitWasTone) {
            if (ditCounter < 2) {  // Dits are 1 unit
                result.push(".")
            } else {  // Dahs are 3 units
                result.push("-");
            }
        } else {
            if (ditCounter > 2 && ditCounter < 5) {  // Detect gap between letters
                result.push(" ")
            } else if (ditCounter > 5) {  // Detect gap between words
                result.push("/");
            }
        }

        ditCounter = 1; // reset counter
        lastDitWasTone = !lastDitWasTone; // update state
    }
    console.log("Finished foo:", result.length, "symbols detected");
    return result;
}

function morseToText(morse) {
    result = '';
    symbol = '';
    for (let i = 0; i < morse.length; i++) {
        if (morse[i] !== ' ' && morse[i] !== '/') {
            symbol += morse[i];
        } else {
            const letter = INVERSE_MORSE[symbol];
            console.log("Detected letter " + letter);
            if (letter) {
                result += letter;
            } else {
                console.warn("Unrecognized Morse code symbol:", symbol);
            }
            symbol = '';
            if (morse[i] === '/') {
                result += ' '; // Space between words
            }
        }
    }
    INVERSE_MORSE[symbol] && (result += INVERSE_MORSE[symbol]); // Add last symbol if any
    return result;
}

export async function decodeMorse(uri) {
    try {
        console.log("Decoding Morse from URI:", uri);
        const { pcm, sampleRate } = await readWavPCM(uri);
        console.log("PCM Data Length:", pcm.length, "Sample Rate:", sampleRate);
        const normalizedPCM = normalizeToPeak(pcm);
        console.log("Normalized PCM Data Length:", normalizedPCM.length);
        const morse = pcmToMorse(normalizedPCM, sampleRate);
        console.log("Detected Morse:", morse);
        const text = morseToText(morse);
        console.log("Decoded Text:", text);
        return {text, morse};
    } catch (error) {
        console.error("Error decoding Morse code:", error);
        throw error; // Re-throw the error for further handling
    }
}

// ***************************+++++++++++*********************************

export async function encodeMorse(morse, filenamePrefix) {
    console.log("Morse Code:", morse);
    const pcm = morseToPCM(morse);
    console.log("PCM Data Length:", pcm.length);
    const wavBuffer = encodeWAV(pcm);
    console.log("WAV Buffer Created: ", wavBuffer.length, "bytes");
    const uri = FileSystem.documentDirectory + filenamePrefix + '_morse.wav';
    console.log("WAV URI:", uri);
    const base64 = fromByteArray(wavBuffer);
    console.log("Writing WAV file to:", uri);
    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
    console.log("WAV file written successfully:", uri);
    return uri;
}

export function playUri(uri) {
    try {
        const player = createAudioPlayer(uri);
        player.play();
    } catch (error) {
        console.error("Error occured while trying to play uri: " + uri);
        console.error(error);
    }
}