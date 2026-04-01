package at.technikum_wien.backend.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;

public class AudioUtil {

    public static byte[] convertPcmToWav(byte[] pcmData, int sampleRate, int channels, int bitsPerSample) {

        int byteRate = sampleRate * channels * bitsPerSample / 8;
        int dataLength = pcmData.length;
        int totalLength = 44 + dataLength;

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            // RIFF header
            out.write("RIFF".getBytes());
            writeInt(out, totalLength - 8);
            out.write("WAVE".getBytes());

            // fmt chunk
            out.write("fmt ".getBytes());
            writeInt(out, 16); // PCM chunk size
            writeShort(out, (short) 1); // PCM format
            writeShort(out, (short) channels);
            writeInt(out, sampleRate);
            writeInt(out, byteRate);
            writeShort(out, (short) (channels * bitsPerSample / 8));
            writeShort(out, (short) bitsPerSample);

            // data chunk
            out.write("data".getBytes());
            writeInt(out, dataLength);
            out.write(pcmData);

        } catch (IOException e) {
            throw new RuntimeException("WAV conversion failed", e);
        }

        return out.toByteArray();
    }

    private static void writeInt(OutputStream out, int value) throws IOException {
        out.write(value & 0xff);
        out.write((value >> 8) & 0xff);
        out.write((value >> 16) & 0xff);
        out.write((value >> 24) & 0xff);
    }

    private static void writeShort(OutputStream out, short value) throws IOException {
        out.write(value & 0xff);
        out.write((value >> 8) & 0xff);
    }
}