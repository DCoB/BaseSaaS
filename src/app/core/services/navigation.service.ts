import { Injectable, signal, inject } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly location = inject(Location);
  public readonly showNavigation = signal(true);
  public readonly isAppLoading = signal(false);

  back(): void {
    this.location.back();
  }

  async showLoadingScreen(minDurationMs = 1500): Promise<void> {
    this.isAppLoading.set(true);
    await new Promise(resolve => setTimeout(resolve, minDurationMs));
    this.isAppLoading.set(false);
  }
}
