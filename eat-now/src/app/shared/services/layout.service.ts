// src/app/services/layout.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private collapsedSubject = new BehaviorSubject<boolean>(false); // false = expanded
  collapsed$ = this.collapsedSubject.asObservable();

  toggle() {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }

  get isCollapsed() {
    return this.collapsedSubject.value;
  }
}