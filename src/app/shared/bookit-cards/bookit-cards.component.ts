import {Component, Input, ViewEncapsulation, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-bookit-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bookit-cards.component.html',
  styleUrl: './bookit-cards.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class BookitCardsComponent {
  @Input() cardName!: string;
  @Input() iconName!: string;
  @Input() path!: string;
}
