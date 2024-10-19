import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {

  // Create a BehaviorSubject with an initial value of 'false'
  private visibilitySubject = new BehaviorSubject<boolean>(false);

  // Expose the BehaviorSubject as an observable
  visibility$ = this.visibilitySubject.asObservable();

  constructor() {}

  // Method to toggle the value of visibility
  toggleVisibility(isVisible: boolean) {
    this.visibilitySubject.next(isVisible);
  }
}
