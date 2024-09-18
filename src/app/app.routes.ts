import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthGuardService } from './authentication/services/auth-guard.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { inject } from '@angular/core';
import { HotelSetupComponent } from './pages/hotel-setup/hotel-setup.component';
import { AdminSetupComponent } from './pages/admin-setup/admin-setup.component';
import { AddCountryComponent } from './pages/masters/country/add-country/add-country.component';
import { EditCountryComponent } from './pages/masters/country/edit-country/edit-country.component';
import { editUserResolver, userListResolver } from './pages/users/edit-user/edit-user-resolver';
import { guestDataResolver } from './pages/guest/guest-data.resolver';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { ChatComponent } from './pages/chat/chat.component';
import { LogutComponent } from './pages/logut/logut.component';
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import( './shared/layout/layout.component' ).then( m => m.LayoutComponent ),
    runGuardsAndResolvers: 'paramsChange',
    // component: LayoutComponent,
    canActivate: [( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) =>
      inject( AuthGuardService ).canActivate( route, state )],
    canActivateChild: [( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) =>
      inject( AuthGuardService ).canActivateChild( route, state )],
    children: [
      {
        path: 'hotel-setup', component: HotelSetupComponent
      },
      { path: 'chat', component: ChatComponent },
      {
        path: 'logout',
        component: LogutComponent
      },
      { path: 'join-room', component: JoinRoomComponent },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'country',
        loadComponent: () => import( './pages/masters/country/country.component' ).then( m => m.CountryComponent ),
        children: [
          {
            path: 'add',
            component: AddCountryComponent
          },
          {
            path: 'edit/:country-id',
            component: EditCountryComponent
          }
        ]
      },
      {
        path: 'city',
        loadComponent: () => import( './pages/masters/city/city.component' ).then( m => m.CityComponent ),
        children: [
          {
            path: 'add',
            loadComponent: () => import( './pages/masters/city/add-city/add-city.component' ).then( m => m.AddCityComponent ),
          },
          {
            path: 'list',
            loadComponent: () => import( './pages/masters/city/city-list/city-list.component' ).then( m => m.CityListComponent ),
          },
          {
            path: 'edit/:city-id',
            loadComponent: () => import( './pages/masters/city/edit-city/edit-city.component' ).then( m => m.EditCityComponent )
          }
        ]
      },
      {
        path: 'state',
        loadComponent: () => import( './pages/masters/states/states.component' ).then( m => m.StatesComponent ),
        children: [
          {
            path: 'list',
            loadComponent: () => import( './pages/masters/states/state-list/state-list.component' ).then( m => m.StateListComponent ),
          },
          {
            path: 'edit/:state-id',
            loadComponent: () => import( './pages/masters/states/edit-state/edit-state.component' ).then( m => m.EditStateComponent )
          },
          {
            path: 'add',
            loadComponent: () => import( './pages/masters/states/add-state/add-state.component' ).then( m => m.AddStateComponent ),
          }
        ]
      },
      {
        path: 'users',
        loadComponent: () => import( './pages/users/users.component' ).then( m => m.UsersComponent ),
        resolve: { user: userListResolver },
        // component: UsersComponent,
        children: [
          {
            path: 'list',
            loadComponent: () => import( './pages/users/list-user/list-user.component' ).then( m => m.ListUserComponent ),
            resolve: { user: userListResolver },
          },
          {
            path: 'edit/:user-id',
            loadComponent: () => import( './pages/users/edit-user/edit-user.component' ).then( m => m.EditUserComponent ),
            resolve: { user: editUserResolver }
          },
          {
            path: 'add',
            loadComponent: () => import( './pages/users/add-user/add-user.component' ).then( m => m.AddUserComponent ),
          }
        ]
      },
      {
        path: 'room',
        loadComponent: () => import( './pages/masters/room/room.component' ).then( m => m.RoomComponent ),
        children: [
          {
            path: 'add',
            loadComponent: () => import( './pages/masters/room/add-room/add-room.component' ).then( m => m.AddRoomComponent ),
          },
          {
            path: 'edit/:room-id',
            loadComponent: () => import( './pages/masters/room/edit-room/edit-room.component' ).then( m => m.EditRoomComponent ),
          },
          {
            path: 'list',
            loadComponent: () => import( './pages/masters/room/room-list/room-list.component' ).then( m => m.RoomListComponent ),
          }
        ]
      },
      {
        path: 'guest',
        resolve: { data: guestDataResolver },
        // component: GuestComponent,
        loadComponent: () => import( './pages/guest/guest.component' ).then( m => m.GuestComponent ),
        children: [
          // {
          //   path: 'add-guest',
          //   loadComponent: () => import( './pages/guest/add-guest/add-guest.component' ).then( m => m.AddGuestComponent ),
          //   title: 'Add Guest',
          //   pathMatch: 'full'
          // },
          // {
          //   path: 'edit/:guest-id',
          //   loadComponent: () => import( './pages/guest/edit-guest/edit-guest.component' ).then( m => m.EditGuestComponent ),
          // },
          {
            path: 'list',
            loadComponent: () => import( './pages/guest/guest-list/guest-list.component' ).then( m => m.GuestListComponent ).finally( () => {
            } ),
            pathMatch: 'full'
          }
        ],
      },
      {
        path: 'guest/add-guest',
        loadComponent: () => import( './pages/guest/add-guest/add-guest.component' ).then( m => m.AddGuestComponent ),
        title: 'Add Guest',
        pathMatch: 'full'
      },
      {
        path: 'guest/edit/:guest-id',
        loadComponent: () => import( './pages/guest/edit-guest/edit-guest.component' ).then( m => m.EditGuestComponent ),
        title: 'Edit Guest',
        pathMatch: 'full'
      }

    ]
  },

  {
    path: '',
    component: LoginComponent, pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import( './pages/login/login.component' ).then( m => m.LoginComponent ),
  },
  // {
  //   path: 'signup', component: SignupComponent
  // },
  // {
  //   path: 'hotel-setup', component: HotelSetupComponent
  // },
  {
    path: 'admin', component: AdminComponent
  },
  // { path: 'admin-setup', component: AdminSetupComponent },
  { path: '**', redirectTo: '/login' }
];
