import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SessionStorageService extends StorageService {
  constructor() {
    const w = typeof window === 'undefined' ? null : window.sessionStorage;
    super(window.sessionStorage);
  }
}
