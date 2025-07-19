import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    const currentTheme = this.themeService.theme();
    const newTheme = {
      ...currentTheme,
      mode: currentTheme.mode === 'dark' ? 'light' : 'dark'
    };
    this.themeService.theme.set(newTheme);
  }
} 