import { ResolveFn } from '@angular/router';
import { ApiResponse } from '../../models/response';
import { GuestService } from '../../_services/guest.service';
import { inject } from '@angular/core';
import { MessageService } from '../../_services/message.service';

export const guestDataResolver: ResolveFn<ApiResponse> = ( route, state ) => {
  const guestService = inject( GuestService );
  const messageService = inject( MessageService );
  messageService.sendMessage( true );
  return guestService.getAllGuest();
};
