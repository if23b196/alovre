import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TextUploadPayload {
  title: string;
  language: string;
  text: string;
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
}
