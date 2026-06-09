package at.technikum_wien.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@Slf4j
public class PdfService {

    /**
     * Extracts text from a PDF InputStream.
     *
     * @param pdfInputStream the PDF file as InputStream
     * @return the extracted text as String
     */
    public String extractText(InputStream pdfInputStream) {
        try (PDDocument document = PDDocument.load(pdfInputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document).trim();
        } catch (Exception e) {
            log.error("Failed to extract text from PDF", e);
            throw new RuntimeException("PDF extraction failed", e);
        }
    }
}
