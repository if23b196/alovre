import { Component, input, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, MatIconModule],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelector {
  // Inputs from parent
  currentLang = input.required<string>();
  languages = input.required<{ code: string; label: string }[]>();

  // Output event when user changes language
  langChange = output<string>();

  onSelectionChange(langCode: string): void {
    this.langChange.emit(langCode);
  }
}
