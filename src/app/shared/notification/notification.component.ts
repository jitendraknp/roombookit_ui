import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../notification/notification.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PopoverModule } from 'primeng/popover';
@Component( {
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    OverlayModule,
    OverlayPanelModule,
    AvatarModule,
    OverlayBadgeModule,
    PopoverModule
  ],
  template: `
       <!-- <p-button icon="pi pi-bell" [rounded]="true"
                 (click)="op.toggle($event)"
                 class="notification-icon"
                 size="small"
                 severity="secondary"
                  badge="{{ notifications.length }}" />   -->
                  
             <p-overlay-badge badgeSize="small"  
             [styleClass]="'text-xs'"
             value="{{ notifications.length }}" size="small"    severity="danger" class="inline-flex mr-3" >
                  <p-avatar  [ngStyle]="{'font-size': '0.8rem'}" icon="pi pi-bell"  size="normal" shape="circle"  (click)="op.toggle($event)"/>
              </p-overlay-badge>
        <p-popover #op>
            <div class="flex flex-col gap-4">
               <div>
                 <span class="font-semibold block mb-2">Notifications</span>
                   <ul class="list-none p-0 m-0 flex flex-col">
                    <li
                        *ngFor="let notification of notifications"
                        class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border"  >
                        <div>
                            <span class="text-xs">{{ notification}}</span>
                            <!-- <div class="text-sm text-surface-500 dark:text-surface-400">{{ member.email }}</div> -->
                        </div>
                    </li>
                </ul>
                </div>
            </div>
        </p-popover>
         <p-toast class="text-xs"
         key="toast2"  position="bottom-left"
          [showTransformOptions]="'translateY(100%)'"
    [showTransitionOptions]="'1000ms'"
    [hideTransitionOptions]="'1000ms'"
    [showTransformOptions]="'translateX(100%)'"
         ></p-toast>
    `,
  styles: [`
          p-overlay-badge > div > p-badge > span  {
            width: 5px;
            top: 10px !important;
        }
        .notification-icon {
            position: relative;
            margin-right: 1rem;
        }
        .notification-count {
            position: absolute;
            top: -5px;
            right: -10px;
            background-color: red;
            color: white;
            border-radius: 50%;
            padding: 0.2em 0.5em;
            font-size: 0.75rem;
            min-width: 20px; /* Ensure a minimum size */
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .notification-dropdown {
         
            overflow-y: auto;
        }
        .notification-item {
            padding: 0.5rem 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .notification-item:last-child {
            border-bottom: none;
        }
    `],
  providers: [MessageService]
} )
export class NotificationComponent implements OnInit {
  notifications: string[] = [];
  @ViewChild( 'op' ) overlayPanel!: OverlayPanel;
  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef, ) { }

  ngOnInit () {
    this.notificationService.getNotifications().subscribe( message => {
      this.messageService.addAll( [{ key: 'toast2', severity: 'contrast', summary: 'Notification', detail: message }] );
      this.notifications.push( message );

      this.cdr.markForCheck();
    } );
  }
  toggleNotifications ( op: any ) {
    op.toggle( event );
  }
  showToast () {
    // Logic to display toast notifications if needed
  }
}
