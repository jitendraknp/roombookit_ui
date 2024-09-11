import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardDetails } from '../../models/card_details';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedDataService } from '../../_services/shared-data.service';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardListComponent implements OnInit {
  ngOnInit(): void {
    this.sharedDataService.currentData.subscribe((data) => {
      this.cardDetail = data;
    });
  }
  @Output() onIsActive = new EventEmitter<CardDetails>();
  @Input() isRecordUpdated!: Observable<boolean>;
  @Input() cardDetails: CardDetails | undefined;
  @Input() cardDetail: CardDetails[] = [];
  constructor(private sharedDataService: SharedDataService) {
    this.sharedDataService.currentData.subscribe((data) => {
      this.cardDetail = data;
    });
  }
  isActive: boolean = false;

  toggleStatus(cardDetails: any) {
    // cardDetails.Is_Active = !cardDetails.Is_Active;
    this.onIsActive.emit(cardDetails);
  }
  onIsActiveClicked(): void {

  }
}
