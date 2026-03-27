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


- If there is "\n" in the text, I want the text to be displayed accordingly, meaning a newline/paragraph should start.
- Perhaps the possibility of editing the contents text in the reading interface, so the user can manually correct mistakes.
When uploading a document, the user should be able to choose the language the content is in. 
There should be a button in the reading interface to be able to select the language they want the translations in.
Surrounding text around the selected word should also be given to Gemini for more accurate translations.
- Surrounding text around the selected word should also be given to Nano Banana for more accurate translations.

Nano Banana:
gemini 2.5 flash image: Quota Exceeded (Error 429), run out of "credits" or "turns" for the Free Tier of the Gemini API.
gemini 2.5 flash image preview: Model Not Found (Error 404), API Docs says this is deprecated.

Nano Banana 2 (gemini-3.1-flash-image-preview): Quota Exceeded (429) error
Nano Banana 2 Pro (gemini-3-pro-image-preview): Quota Exceeded (429) error