import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingScreenService {
  isLoading = signal(false);
}
