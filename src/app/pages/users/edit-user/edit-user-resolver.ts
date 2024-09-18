import { ResolveFn } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { inject } from '@angular/core';
import { ApiResponse } from '../../../models/response';
import { CustomMessageService } from '../../../_services/custom-message.service';

export const editUserResolver: ResolveFn<ApiResponse> = ( route, state ) => {
  const userService = inject( UserService );
  return userService.getUserById( route.paramMap.get( 'user-id' )! );
};
export const userListResolver: ResolveFn<ApiResponse> = ( route, state ) => {
  const userService = inject( UserService );

  return userService.getAll();
};
