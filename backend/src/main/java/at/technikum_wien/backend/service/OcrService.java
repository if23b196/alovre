package at.technikum_wien.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class OcrService {

    private final TesseractOcrEngine ocrEngine;

    public String extractText(InputStream inputStream) {
        return ocrEngine.doOcr(inputStream);
    }
}