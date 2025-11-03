
// src/app/services/config.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Config {
  categories: string[];
  priorities: string[];
}

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private _config = new BehaviorSubject<Config>({
    categories: ['Air Conditioning', 'Plumbing', 'Electrical', 'Furniture'],
    priorities: ['Low', 'Medium', 'High', 'Urgent']
  });

  config$ = this._config.asObservable();

  get config() {0 
    return this._config.value;
  }


updateCategories(cats: string[]) {
    this._config.next({ ...this.config, categories: cats });
  }

  updatePriorities(prios: string[]) {
    this._config.next({ ...this.config, priorities: prios });
  }

}