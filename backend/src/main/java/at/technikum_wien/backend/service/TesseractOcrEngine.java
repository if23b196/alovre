package at.technikum_wien.backend.service;

import at.technikum_wien.backend.config.OcrConfig;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.stereotype.Component;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;

@Component
public class TesseractOcrEngine {

    private final ITesseract tesseract;

    public TesseractOcrEngine(OcrConfig config) {
        tesseract = new Tesseract();
        tesseract.setDatapath(config.getDataPath());
        tesseract.setLanguage(config.getLanguage());
    }

    public String doOcr(InputStream inputStream) {
        try {
            // Write InputStream to temp file
            File tempFile = File.createTempFile("ocr-", ".pdf");
            Files.copy(inputStream, tempFile.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Run Tesseract
            String result = tesseract.doOCR(tempFile);
            tempFile.delete();
            return result.trim();
        } catch (Exception e) {
            throw new RuntimeException("OCR failed", e);
        }
    }
}