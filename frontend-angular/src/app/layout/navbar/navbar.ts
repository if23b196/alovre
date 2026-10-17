import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {LanguageSelector} from '../../shared/components/language-selector/language-selector';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslocoModule, MatToolbarModule,
    MatButtonModule, MatIconModule, LanguageSelector],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private translocoService = inject(TranslocoService);

  // Signal holding the active language (defaults to 'en')
  currentLang = signal<string>(this.translocoService.getActiveLang() || 'en');

  // Signal for dark mode toggle state
  isDarkMode = signal<boolean>(false);

  // Available language list
  languages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'tr', label: 'Türkçe' },
  ];

  // Language switch handler
  onLanguageChange(langCode: string): void {
    this.currentLang.set(langCode);
    this.translocoService.setActiveLang(langCode);
  }

  // Theme toggle handler
  toggleTheme(): void {
    this.isDarkMode.update((dark) => !dark);
    document.body.classList.toggle('dark', this.isDarkMode());
  }
}
