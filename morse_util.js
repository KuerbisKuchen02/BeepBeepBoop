import { fromByteArray } from 'base64-js';
import * as FileSystem from 'expo-file-system';

const MORSE = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.',
    F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---',
    P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--',
    Z: '--..', ' ': '/'
};

export function textToMorse(text) {
    return text.toUpperCase().split('').map(c => MORSE[c] || '').join(' ');
}

function generateTone(frequency, duration, sampleRate = 44100, volume = 1) {
    const length = sampleRate * duration;
    const buffer = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        buffer[i] = volume * Math.sin(2 * Math.PI * frequency * (i / sampleRate));
    }
    return buffer;
}

function generateSilence(duration, sampleRate = 44100) {
    return new Float32Array(sampleRate * duration);
}

function morseToPCM(morse, dit = 0.1, frequency = 440) {
    const sampleRate = 44100;
    let result = new Float32Array();

    for (const symbol of morse) {
        let tone = null;

        if (symbol === '.') {
            console.log("Generating tone for dit");
            tone = generateTone(frequency, dit);
        } else if (symbol === '-') {
            console.log("Generating tone for dah");
            tone = generateTone(frequency, dit * 3);
        } else if (symbol === '/') {
            console.log("Generating silence for space between words");
            tone = generateSilence(dit * 7);
        } else if (symbol === ' ') {
            console.log("Generating silence for space between letters");
            tone = generateSilence(dit * 3);
        } else {
            console.warn("Unrecognized symbol in Morse code:", symbol);
            continue; // Skip unrecognized symbols
        }

        if (tone) {
            const gap = generateSilence(dit);
            const newResult = new Float32Array(result.length + tone.length + gap.length);
            newResult.set(result);
            newResult.set(tone, result.length);
            newResult.set(gap, result.length + tone.length);
            result = newResult;
        }
    }
    // console.log(result);
    return result;
}

function floatTo16BitPCM(floatBuffer) {
    const output = new Int16Array(floatBuffer.length);
    for (let i = 0; i < floatBuffer.length; i++) {
        const s = Math.max(-1, Math.min(1, floatBuffer[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
}

function encodeWAV(float32Data, sampleRate = 44100, numChannels = 1) {
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

export async function encodeMorse(text) {
    const morse = textToMorse(text);
    console.log("Morse Code:", morse);
    const pcm = morseToPCM(morse);
    console.log("PCM Data Length:", pcm.length);
    const wavBuffer = encodeWAV(pcm);
    console.log("WAV Buffer Created: ", wavBuffer.length, "bytes");
    const uri = FileSystem.documentDirectory + 'morse.wav';
    console.log("WAV URI:", uri);
    const base64 = fromByteArray(wavBuffer);
    console.log("Writing WAV file to:", uri);
    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
    console.log("WAV file written successfully:", uri);
    return uri;
}