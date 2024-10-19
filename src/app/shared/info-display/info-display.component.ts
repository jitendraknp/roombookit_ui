import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
@Component( {
  selector: 'app-info-display',
  standalone: true,
  imports: [CardModule],
  templateUrl: './info-display.component.html',
  styleUrl: './info-display.component.css'
} )
export class InfoDisplayComponent {
  @Input() title: string = 'Default Title';
  @Input() content: string = 'Default content goes here.';
}
