import { Injectable } from '@angular/core';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  color: string;
  fontFamily: string;
  _initialized?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly MODE_KEY = 'app-mode';
  private readonly BRAND_KEY = 'app-brand';
  private readonly FONT_KEY = 'app-font';
  private readonly STORAGE_KEY = 'app-theme';

  private state: ThemeState = {
    mode: 'light',
    color: '#8A4A9F',
    fontFamily: 'Poppins',
    _initialized: false
  };

  constructor() {
    // Load combined theme state if present
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<ThemeState>;
        if (parsed.mode === 'light' || parsed.mode === 'dark') this.state.mode = parsed.mode;
        if (typeof parsed.color === 'string' && parsed.color) this.state.color = parsed.color;
        if (typeof parsed.fontFamily === 'string' && parsed.fontFamily) this.state.fontFamily = parsed.fontFamily;
        this.state._initialized = true;
      } catch {
        // ignore malformed storage
      }
    } else {
      // Fallback to legacy keys if they exist
      const m = localStorage.getItem(this.MODE_KEY);
      const b = localStorage.getItem(this.BRAND_KEY);
      const f = localStorage.getItem(this.FONT_KEY);
      if (m === 'light' || m === 'dark') this.state.mode = m;
      if (b) this.state.color = b;
      if (f) this.state.fontFamily = f;
    }

    // Apply on service creation so app looks correct before user toggles
    this.apply();
  }

  getState(): ThemeState {
    return { ...this.state };
  }

  init(): void {
    // If no mode persisted, use system preference once
    if (!this.state._initialized) {
      this.state.mode = this.getSystemPref();
      this.state._initialized = true;
      this.persist();
      this.apply();
    }
  }

  setMode(mode: ThemeMode, opts?: { silent?: boolean }): void {
    if (mode !== 'light' && mode !== 'dark') return;
    this.state.mode = mode;
    this.state._initialized = true;
    if (!opts?.silent) this.persist();
    this.apply();
  }

  setBrandColor(hex: string, opts?: { silent?: boolean }): void {
    if (!hex) return;
    this.state.color = hex;
    if (!opts?.silent) this.persist();
    this.apply();
  }

  setFontFamily(font: string, opts?: { silent?: boolean }): void {
    if (!font) return;
    this.state.fontFamily = font;
    if (!opts?.silent) this.persist();
    this.apply();
  }

  // Applies CSS variables + data attributes so your SCSS picks them up
  private apply(): void {
    const { color, mode, fontFamily } = this.state;
    const root = document.documentElement;

    root.setAttribute('data-theme', mode);
    root.setAttribute('data-brand-color', color);

    // Dynamic brand colors (SCSS theme owns the rest of the palette)
    root.style.setProperty('--brand-primary', color);
    root.style.setProperty('--brand-primary-700', this.shade(color, -12));
    root.style.setProperty('--brand-primary-200', this.shade(color, 28));
    root.style.setProperty('--brand-primary-light', this.shade(color, 42));
    root.style.setProperty('--brand-primary-dark', this.shade(color, -24));

    // Dynamic font
    root.style.setProperty('--font-family', fontFamily + ', sans-serif');

    // Also keep legacy keys in sync if other parts read them
    localStorage.setItem(this.MODE_KEY, mode);
    localStorage.setItem(this.BRAND_KEY, color);
    localStorage.setItem(this.FONT_KEY, fontFamily);
  }

  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  // Simple hex lighten/darken
  private shade(hex: string, percent: number): string {
    const f = hex.startsWith('#') ? hex.slice(1) : hex;
    const num = parseInt(f, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;

    r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)));
    g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)));
    b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)));

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
  }

  private getSystemPref(): ThemeMode {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}