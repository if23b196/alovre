package at.technikum_wien.backend.service;

import at.technikum_wien.backend.dto.content.ContentListResponse;
import at.technikum_wien.backend.model.Content;
import at.technikum_wien.backend.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContentService {

    private final ContentRepository contentRepository;
    private final StorageService storageService;
    private final PdfService pdfService;
    private final OcrService ocrService;

    public Content uploadDocument(String title, MultipartFile file) {

        // 1. Upload file to MinIO
        String objectKey = storageService.upload(file);

        // 2. Create the content entity (immediately!)
        Content content = new Content();
        content.setTitle(title);

        String contentType = file.getContentType();

        if (contentType != null && contentType.equals("application/pdf")) {
            content.setType(Content.ContentType.PDF);
        } else {
            content.setType(Content.ContentType.TXT);
        }

        content.setFileName(file.getOriginalFilename());
        content.setFileSize(file.getSize());
        content.setUploadTimestamp(LocalDateTime.now());
        content.setMinioObjectKey(objectKey);
        content.setOcrProcessed(false);

        // 3. Save to DB
        Content saved = contentRepository.save(content);

        // 4. Start async processing
        processDocumentAsync(saved.getId());

        return saved;
    }

    @Async
    public void processDocumentAsync(Long contentId) {
        try {
            Content content = contentRepository.findById(contentId).orElseThrow();

            if (content.getType() == Content.ContentType.PDF) {
                try (InputStream pdfStream = storageService.download(content.getMinioObjectKey())) {
                    String extractedText = pdfService.extractText(pdfStream);

                    if (extractedText.isBlank()) {
                        // Fallback to OCR for scanned PDFs
                        extractedText = ocrService.extractText(storageService.download(content.getMinioObjectKey()));
                    }

                    content.setTextContent(extractedText);
                }
            } else {
                // For TXT files, you could download and read as plain text
                try (InputStream txtStream = storageService.download(content.getMinioObjectKey())) {
                    String text = new String(txtStream.readAllBytes());
                    content.setTextContent(text);
                }
            }

            content.setOcrProcessed(true);
            contentRepository.save(content);

        } catch (Exception e) {
            log.error("Error processing document with ID {}", contentId, e);
        }
    }

    public Content uploadText(String title, String text) {

        Content content = new Content();
        content.setTitle(title);
        content.setType(Content.ContentType.TEXT);
        content.setTextContent(text);
        content.setUploadTimestamp(LocalDateTime.now());

        // No file-related fields needed
        content.setOcrProcessed(true); // already "processed"

        return contentRepository.save(content);
    }

    public List<ContentListResponse> getAllContent() {

        return contentRepository.findAll()
                .stream()
                .map(content -> new ContentListResponse(
                        content.getId(),
                        content.getTitle(),
                        content.getType(),
                        content.getFileSize(),
                        content.getUploadTimestamp(),
                        content.getOcrProcessed()
                ))
                .toList();
    }

    public void deleteContent(Long id) {

        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        // delete file from MinIO if exists
        if (content.getMinioObjectKey() != null) {
            storageService.delete(content.getMinioObjectKey());
        }

        contentRepository.delete(content);
    }

    public Content updateTitle(Long id, String title) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        content.setTitle(title);
        return contentRepository.save(content);
    }
}
