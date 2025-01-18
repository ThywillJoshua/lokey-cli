import { signal, WritableSignal } from '@angular/core';
import { IStorage } from './storage.model';

export class StorageService {
  private storage?: Storage;
  private signals?: Map<string, WritableSignal<any>>;

  constructor(storage: Storage | null) {
    if (storage) {
      this.storage = storage;
      this.signals = new Map<string, WritableSignal<any>>();
    }
  }

  watch<T>(key: keyof IStorage): WritableSignal<T | null> | undefined {
    if (!this.signals?.has(key)) {
      this.signals?.set(key, signal<T | null>(null));
    }
    const itemFromStorage = this.storage?.getItem(key);
    const parsed = !itemFromStorage ? null : JSON.parse(itemFromStorage);

    this.signals?.get(key)?.set(parsed);
    return this.signals?.get(key);
  }

  get<T>(key: keyof IStorage): T | null {
    var item = this.storage?.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    return null;
  }

  set<T>(key: keyof IStorage, value: T) {
    this.storage?.setItem(key, JSON.stringify(value));
    if (!this.signals?.has(key)) {
      this.signals?.set(key, signal<T>(value));
    } else {
      this.signals?.get(key)?.set(value);
    }
  }

  remove(key: string) {
    if (this.signals?.has(key)) {
      this.signals?.delete(key);
    }
    this.storage?.removeItem(key);
  }

  clear() {
    this.signals?.clear();
    this.storage?.clear();
  }
}
