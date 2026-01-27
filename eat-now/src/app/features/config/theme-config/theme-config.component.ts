import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.scss']
})
export class ThemeConfigComponent implements OnInit {
  state: any;
  presetColors = [
    '#002B61', // Zeste Primary
    '#8A4A9F', // Purple
    '#2A69A6', // blue
    '#28A745', // green
    '#F39C12', // orange
    '#DC3545', // red
    '#17A2B8', // cyan
    '#343A40'  // dark
  ];

  constructor(private theme: ThemeService) { }

  ngOnInit(): void {
    this.state = this.theme.getState();
  }

  setMode(mode: 'light' | 'dark'): void {
    this.theme.setMode(mode);
    this.state.mode = mode;
  }

  setBrandColor(color: string): void {
    this.theme.setBrandColor(color);
    this.state.color = color;
  }

  onCustomColorChange(event: any): void {
    const color = event.target.value;
    this.setBrandColor(color);
  }
}
