import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TextUploadPayload {
  title: string;
  language: string;
  text: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'TEXT' | 'PDF' | 'TXT' | string;
  language: string;
  uploadTimestamp: string | number[];
  fileSize: number | null;
  ocrProcessed: boolean;
}

export interface ContentDetail extends ContentItem {
  textContent?: string;
  annotations?: Array<{ selectedText: string; generatedText: string }>;
  images?: Array<{ selectedText: string; minioObjectKey: string }>;
  audios?: Array<{ text: string; minioObjectKey: string }>;
}

@Injectable({ providedIn: 'root' })
export class ContentApi {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/content';

  uploadDocument(title: string, language: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('language', language);
    formData.append('file', file);

    return this.http.post<void>(`${this.baseUrl}/upload/document`, formData);
  }

  uploadText(payload: TextUploadPayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/upload/text`, payload);
  }

  getLibraryItems(): Observable<ContentItem[]> {
    return this.http.get<ContentItem[]>(this.baseUrl);
  }

  getContent(id: string): Observable<ContentDetail> {
    return this.http.get<ContentDetail>(`${this.baseUrl}/${id}`);
  }

  updateContentTitle(id: string, title: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { title });
  }

  deleteContent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
