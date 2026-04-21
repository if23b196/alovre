# alovre

Your second-language reading app with helpful AI features. **alovre** helps users read content in a foreign language by providing instant translations, context-aware image generation for vocabulary, and text-to-speech (TTS) pronunciation using Google Gemini AI.

## Features

- **Reading Interface**: Interactive text display where you can select words for help.
- **AI Translations**: Get context-aware translations and brief explanations for selected words.
- **AI Image Generation**: Visualize words with AI-generated images to aid memory.
- **AI Text-to-Speech**: Listen to the correct pronunciation of words.
- **Document Upload**: Support for plain text and PDF files (with OCR support via Tesseract).
- **Library Management**: Keep track of your uploaded content and progress.

## Tech Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.5.12
- **Database**: PostgreSQL 15
- **Object Storage**: MinIO (for storing uploaded documents and generated AI assets)
- **AI Integration**: Google Gemini SDK (`google-genai`)
- **OCR**: Tesseract OCR
- **Build Tool**: Maven

### Frontend
- **Languages**: HTML5, CSS3, Vanilla JavaScript
- **Web Server**: Nginx

### Infrastructure
- **Containerization**: Docker & Docker Compose

## Requirements

- **IntelliJ Ultimate** (IDE)
- **Docker Desktop** (includes Docker and Docker Compose)
- **Google Gemini API Key** (required for AI features)

> **Note**: If using Docker, you do **not** need to install PostgreSQL, MinIO, or Tesseract OCR manually. Everything is handled within the containers.

## Setup and Run

Everything can be run directly from the project root directory.

### Using Docker Compose

1. Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

2. Build and start all services (run this from the root directory):
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - **Frontend**: [http://localhost:8081](http://localhost:8081)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)
   - **MinIO Console**: [http://localhost:9001](http://localhost:9001) (User/Pass: `minioadmin`/`minioadmin`)

## Environment Variables

The following environment variables are used in `docker-compose.yml`:

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API Key | (Required) |
| `SPRING_DATASOURCE_URL` | JDBC URL for PostgreSQL | `jdbc:postgresql://postgres:5432/readingdb` |
| `MINIO_URL` | MinIO API Endpoint | `http://minio:9000` |
| `MINIO_BUCKET` | MinIO bucket name | `documents` |

## Project Structure

```text
.
├── backend/                # Spring Boot application
│   ├── src/main/java/...   # Java source code
│   │   ├── controller/     # REST API Controllers
│   │   ├── service/        # Business logic (AI, Storage, OCR, PDF)
│   │   ├── model/          # JPA Entities (Database tables)
│   │   ├── repository/     # Data Access Layer (Spring Data JPA)
│   │   ├── dto/            # Data Transfer Objects
│   │   └── config/         # Application configurations (MinIO, Async, Web, OCR)
│   ├── src/main/resources/ # Configuration files (application.properties)
│   ├── pom.xml             # Maven dependencies
│   └── Dockerfile          # Backend container definition (installs Tesseract 5)
├── frontend/               # Static frontend files
│   ├── html/               # HTML pages (index, library, reader, upload)
│   ├── js/                 # Vanilla JavaScript logic
│   ├── css/                # Styling (style.css)
│   ├── nginx.conf          # Nginx configuration (proxies /api to backend)
│   └── Dockerfile          # Frontend container definition (Nginx)
├── docker-compose.yml      # Multi-container orchestration (Postgres, MinIO, Backend, Frontend)
└── .env                    # API keys (not in Git)
```

## Useful Tips

- **Reload Frontend (Windows)**: `Ctrl + Shift + R` (to clear cache and see latest JS/CSS changes).
- **OCR Issues**: If PDF text extraction fails, ensure the document has readable text or clear images. Tesseract is pre-configured in the Docker container.
