import { Component, Input, ViewEncapsulation, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-bookit-cards',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatDividerModule, MatIconModule, RouterModule],
  templateUrl: './bookit-cards.component.html',
  styleUrl: './bookit-cards.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class BookitCardsComponent {
  @Input() cardName!: string;
  @Input() iconName!: string;
  @Input() path!: string;
}
