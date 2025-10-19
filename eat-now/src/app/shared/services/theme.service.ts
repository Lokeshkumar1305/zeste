import { Injectable } from '@angular/core';

type ThemeMode = 'light' | 'dark';
interface ThemeState {
  mode: ThemeMode;
  color: string;
  _initialized?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'app-theme';
  private state: ThemeState = {
    mode: 'light',
    color: '#8A4A9F', // default close to screenshot family
    _initialized: false
  };

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ThemeState;
        if (parsed?.mode) this.state.mode = parsed.mode;
        if (parsed?.color) this.state.color = parsed.color;
        this.state._initialized = true;
      } catch {
        // ignore
      }
    }
  }

  getState(): ThemeState {
    return { ...this.state };
  }

  setMode(mode: ThemeMode, opts?: { silent?: boolean }): void {
    this.state.mode = mode;
    this.state._initialized = true;
    if (!opts?.silent) this.persist();
    this.apply();
  }

  setBrandColor(color: string): void {
    this.state.color = color;
    this.state._initialized = true;
    this.persist();
    this.apply();
  }

  apply(): void {
    const { color, mode } = this.state;
    const root = document.documentElement;

    // Accent color + derived shades
    root.style.setProperty('--brand-primary', color);
    root.style.setProperty('--brand-primary-700', this.shade(color, -12));
    root.style.setProperty('--brand-primary-200', this.shade(color, 28));
    root.style.setProperty('--header-background', color);

    if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--card-background', '#1F2937');
      root.style.setProperty('--card-border', '#2A3646');
      root.style.setProperty('--input-background', '#111827');
      root.style.setProperty('--text-color', '#E5E7EB');
      root.style.setProperty('--text-muted', '#9CA3AF');
      root.style.setProperty('--button-text', '#FFFFFF');
      root.style.setProperty('--app-background', '#0B1020');
    } else {
      root.setAttribute('data-theme', 'light');
      root.style.setProperty('--card-background', '#FFFFFF');
      root.style.setProperty('--card-border', '#E6E8EB');
      root.style.setProperty('--input-background', '#F3F4F6');
      root.style.setProperty('--text-color', '#1F2937');
      root.style.setProperty('--text-muted', '#6B7280');
      root.style.setProperty('--button-text', '#FFFFFF');
      root.style.setProperty('--app-background', '#F5F7FB');
    }
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  // Simple hex shade util
  private shade(hex: string, percent: number): string {
    const f = hex.startsWith('#') ? hex.slice(1) : hex;
    const num = parseInt(f, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;

    r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)));
    g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)));
    b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)));

    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0').toUpperCase()}`;
  }
}