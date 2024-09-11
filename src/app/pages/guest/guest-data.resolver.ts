import { ResolveFn } from '@angular/router';
import { ApiResponse } from '../../models/response';
import { GuestService } from '../../_services/guest.service';
import { inject } from '@angular/core';

export const guestDataResolver: ResolveFn<ApiResponse> = (route, state) => {
  const guestService = inject(GuestService);
  return guestService.getAllGuest();
};
