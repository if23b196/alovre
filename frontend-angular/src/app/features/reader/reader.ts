import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Observable, map } from 'rxjs';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ContentApi, ContentItem } from '../../core/services/content-api';
import { AiApi } from '../../core/services/ai-api';
import { Notification } from '../../core/services/notification';

interface ToolHistoryItem {
  word: string;
  result: string;
}

interface ToolState {
  history: ToolHistoryItem[];
  currentIndex: number;
}

type ToolType = 'translate' | 'image' | 'audio';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TranslocoDirective,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './reader.html',
  styleUrl: './reader.scss',
})
export class Reader implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentApi = inject(ContentApi);
  private aiApi = inject(AiApi);
  private notification = inject(Notification);
  private transloco = inject(TranslocoService);

  // Document state
  documentId = signal<string | null>(null);
  documentTitle = signal('');
  documentText = signal('');

  // Selection state
  selectedWord = signal<string | null>(null);
  selectedTokenElement = signal<HTMLElement | null>(null);

  // Target language picker state
  targetLanguage = signal('English');

  // Tool states mapped cleanly
  translateState = signal<ToolState>({ history: [], currentIndex: -1 });
  imageState = signal<ToolState>({ history: [], currentIndex: -1 });
  audioState = signal<ToolState>({ history: [], currentIndex: -1 });

  hasSelection = computed(() => this.selectedWord() !== null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notification.show(this.transloco.translate('reader.errors.noId'), true);
      void this.router.navigate(['/library']);
      return;
    }
    this.documentId.set(id);
    this.fetchDocumentContent(id);
  }

  private fetchDocumentContent(id: string): void {
    // If it's a mock item, load sample data directly on the frontend
    if (id.startsWith('mock-')) {
      const mockData = {
        id,
        title: id === 'mock-1' ? 'Introduction to Angular Signals' : id === 'mock-2' ? 'Quick Spring Boot Notes' : 'Scanned Document',
        textContent: `This is a sample text content for demonstration purposes. Angular Signals provide a reactive primitive model that allows fine-grained dependency tracking and high performance rendering. When you click on any word in this paragraph, the application extracts its context and lets you translate it, generate an AI visual memory image, or listen to native text-to-speech pronunciation. Try clicking words like reactive, performance, rendering, or application to test out the AI tools!`,
        annotations: [],
        images: [],
        audios: [],
      };
      this.documentTitle.set(mockData.title);
      this.documentText.set(mockData.textContent);
      this.loadInitialToolHistory(mockData);
      return;
    }

    // Otherwise, fetch real data from the backend API
    this.contentApi.getContent(id).subscribe({
      next: (data) => {
        this.documentTitle.set(data.title);
        this.documentText.set(data.textContent || '');
        this.loadInitialToolHistory(data);
      },
      error: () => {
        this.notification.show(this.transloco.translate('reader.errors.fetchFailed'), true);
        void this.router.navigate(['/library']);
      },
    });
  }

  private loadInitialToolHistory(data: any): void {
    const mapHist = (list: any[], resultMapper: (item: any) => { word: string; result: string }): ToolHistoryItem[] =>
      (list || []).map(resultMapper);

    const translateHist = mapHist(data.annotations, (a) => ({ word: a.selectedText, result: a.generatedText }));
    const imageHist = mapHist(data.images, (img) => ({ word: img.selectedText, result: `http://localhost:8080/api/content/image/${img.minioObjectKey}` }));
    const audioHist = mapHist(data.audios, (aud) => ({ word: aud.text, result: `http://localhost:8080/api/content/audio/${aud.minioObjectKey}` }));

    this.setToolState('translate', translateHist);
    this.setToolState('image', imageHist);
    this.setToolState('audio', audioHist);
  }

  private setToolState(tool: ToolType, history: ToolHistoryItem[]): void {
    this.getStateSignal(tool).set({
      history,
      currentIndex: history.length > 0 ? 0 : -1,
    });
  }

  private getStateSignal(tool: ToolType) {
    if (tool === 'translate') return this.translateState;
    if (tool === 'image') return this.imageState;
    return this.audioState;
  }

  // Tokenization & Rendering
  getFormattedParagraphs(): string {
    const text = this.documentText();
    if (!text) return '<p>No text available</p>';

    const wordRegex = /([\p{L}\p{M}0-9'-]+)/gu;
    return text
      .split(/\r?\n\s*\r?\n/)
      .map((para) => {
        const trimmed = para.trim();
        if (!trimmed) return '';

        const paraHtml = trimmed
          .split(wordRegex)
          .map((token) => {
            wordRegex.lastIndex = 0;
            if (wordRegex.test(token)) {
              return `<span class="word" data-word="${token.toLowerCase()}">${token}</span>`;
            }
            return token.replace(/\r?\n/g, ' ');
          })
          .join('');

        return `<p>${paraHtml}</p>`;
      })
      .join('');
  }

  onTextClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('word')) {
      const clickedWordText = target.textContent || '';
      const dataWord = target.dataset['word'] || '';

      document.querySelectorAll('.word').forEach((el) => {
        el.classList.remove('selected', 'instance-highlight');
      });

      document.querySelectorAll(`.word[data-word="${CSS.escape(dataWord)}"]`).forEach((el) => {
        el.classList.add('instance-highlight');
      });

      target.classList.add('selected');
      this.selectedWord.set(clickedWordText);
      this.selectedTokenElement.set(target);
    }
  }

  private getContextSentence(): string {
    const container = document.getElementById('text-content');
    if (!container || !this.selectedTokenElement()) return this.documentText();

    const fullText = container.innerText;
    const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];

    const range = document.createRange();
    range.setStart(container, 0);
    range.setEndBefore(this.selectedTokenElement()!);

    const sentencesBefore = range.toString().match(/[^.!?]+[.!?]+/g) || [];
    const index = sentencesBefore.length;
    const start = Math.max(0, index - 14);

    return sentences.slice(start, index + 1).join(' ').trim();
  }

  // Unified AI Execution Engine
  private executeAiAction(
    tool: ToolType,
    loadingKey: string,
    successKey: string,
    errorKey: string,
    apiStream: (id: string, word: string, context: string) => Observable<{ word?: string; result: string }>
  ): void {
    const word = this.selectedWord();
    const id = this.documentId();

    if (!word || !id) {
      this.notification.show(this.transloco.translate('reader.errors.selectWordFirst'), true);
      return;
    }

    const context = this.getContextSentence();
    this.notification.show(this.transloco.translate(loadingKey), false);

    apiStream(id, word, context).subscribe({
      next: (res) => {
        const stateSignal = this.getStateSignal(tool);
        stateSignal.update((s) => {
          const newHistory = [...s.history, { word: res.word || word, result: res.result }];
          return { history: newHistory, currentIndex: newHistory.length - 1 };
        });
        this.notification.show(this.transloco.translate(successKey), false);
      },
      error: () => this.notification.show(this.transloco.translate(errorKey), true),
    });
  }

  // Public Tool Actions
  explainWord(): void {
    this.executeAiAction(
      'translate',
      'reader.toasts.translating',
      'reader.toasts.translationReady',
      'reader.errors.translationFailed',
      (id, word, context) => this.aiApi.explainWord({
        contentId: id,
        word,
        language: this.targetLanguage(),
        context
      }).pipe(map(res => ({ word: res.word, result: res.result })))
    );
  }

  generateImage(): void {
    this.executeAiAction(
      'image',
      'reader.toasts.generatingImage',
      'reader.toasts.imageReady',
      'reader.errors.imageFailed',
      (id, word, context) => this.aiApi.generateImage({
        contentId: id,
        word,
        context
      }).pipe(map(res => ({ result: `http://localhost:8080/api/content/image/${res.imageKey}` })))
    );
  }

  generateAudio(): void {
    this.executeAiAction(
      'audio',
      'reader.toasts.generatingAudio',
      'reader.toasts.audioReady',
      'reader.errors.audioFailed',
      (id, word) => this.aiApi.generateAudio({
        contentId: id,
        word
      }).pipe(map(res => ({ result: `http://localhost:8080/api/content/audio/${res.audioKey}` })))
    );
  }

  playAudio(url: string): void {
    void new Audio(url).play();
  }

  // Unified Pagination Handler
  movePage(tool: ToolType, delta: number): void {
    const stateSignal = this.getStateSignal(tool);
    const current = stateSignal();
    const newIndex = current.currentIndex + delta;

    if (newIndex >= 0 && newIndex < current.history.length) {
      stateSignal.update((s) => ({ ...s, currentIndex: newIndex }));
    }
  }
}
