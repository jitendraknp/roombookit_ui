import { ResolveFn } from '@angular/router';
import { ApiResponse } from '../../models/response';
import { GuestService } from '../../_services/guest.service';
import { inject } from '@angular/core';
import { CustomMessageService } from '../../_services/custom-message.service';

export const guestDataResolver: ResolveFn<ApiResponse> = ( route, state ) => {
  const guestService = inject( GuestService );
  const messageService = inject( CustomMessageService );
  messageService.sendMessage( true );
  return guestService.getAllGuest();
};
