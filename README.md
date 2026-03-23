# alovre
Your second-language reading app with helpful AI features.

To reload website (frontend) on Windows 11: Ctrl + Shift + R

backend/
└── src/main/java/at/technikum_wien/backend/
    ├── controller/
    │   ├── ContentController.java
    │   └── AiController.java
    │
    ├── dto/
    │   ├── content/
    │   │   ├── UploadTextRequest.java
    │   │   ├── ContentResponse.java
    │   │   └── ContentListResponse.java
    │   │
    │   └── ai/
    │       ├── AnnotationRequest.java
    │       ├── AnnotationResponse.java
    │       ├── ImageRequest.java
    │       ├── ImageResponse.java
    │       ├── TtsRequest.java
    │       └── TtsResponse.java
    │
    ├── service/
    │   ├── ContentService.java
    │   ├── AiService.java
    │   ├── StorageService.java        (MinIO abstraction)
    │   ├── PdfService.java            (PDF extraction)
    │   └── OcrService.java            (Tesseract)
    │
    ├── model/
    │   ├── Content.java
    │   ├── Annotation.java
    │   ├── Image.java
    │   └── Audio.java
    │
    ├── repository/
    │   ├── ContentRepository.java
    │   ├── AnnotationRepository.java
    │   ├── ImageRepository.java
    │   └── AudioRepository.java
    │
    ├── config/
    │   ├── MinioConfig.java
    │   └── AsyncConfig.java
    │
    │
    └── BackendApplication.java