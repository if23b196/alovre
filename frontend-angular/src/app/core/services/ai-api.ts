import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExplainRequest {
  contentId: string;
  word: string;
  language: string;
  context: string;
}

export interface ExplainResponse {
  word: string;
  result: string;
}

export interface ImageRequest {
  contentId: string;
  word: string;
  context: string;
}

export interface ImageResponse {
  imageKey: string;
}

export interface TtsRequest {
  contentId: string;
  word: string;
}

export interface TtsResponse {
  audioKey: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiApi {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/ai';

  // Request AI contextual explanation and translation
  explainWord(request: ExplainRequest): Observable<ExplainResponse> {
    return this.http.post<ExplainResponse>(`${this.baseUrl}/explain`, request);
  }

  // Request AI image generation for a word association
  generateImage(request: ImageRequest): Observable<ImageResponse> {
    return this.http.post<ImageResponse>(`${this.baseUrl}/image`, request);
  }

  // Request Text-to-Speech audio generation for pronunciation
  generateAudio(request: TtsRequest): Observable<TtsResponse> {
    return this.http.post<TtsResponse>(`${this.baseUrl}/tts`, request);
  }
}
