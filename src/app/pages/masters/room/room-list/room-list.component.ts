import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Room } from '../../../../models/room';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomListComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.resetFormSubject);
  }
  @Input() rooms: Room[] = [];
  @Input() resetFormSubject!: Observable<boolean>;
  private sub: any;
  ngOnInit(): void {
    console.log(this.rooms);
    this.sub = this.resetFormSubject?.subscribe((reset) => {
      console.log(reset);
      console.log('reset');
      if (reset) {
        this.rooms = [];
      }
    })
  }
  @Input() cardDetails: Room | undefined;
  toggleStatus(room: any): void {
    room.IsActive = !room.IsActive;
    // Implement the service call to update the room's status
  }
}
