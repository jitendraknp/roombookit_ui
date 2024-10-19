import {Component, Input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CardDetails} from '../../models/card_details';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-common-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './common-card.component.html',
  styleUrl: './common-card.component.css'
})
export class CommonCardComponent {
  @Input() cardName!: string;
  @Input() iconName!: string;
  @Input() path!: string;
  @Input() forEditOnly!: boolean;
  @Input() showHeader: boolean = false;
  @Input() cardDetails: CardDetails | undefined;
}
