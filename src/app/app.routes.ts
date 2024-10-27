import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './authentication/services/auth-guard.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { inject } from '@angular/core';
import { HotelSetupComponent } from './pages/hotel-setup/hotel-setup.component';
import { editUserResolver, userListResolver } from './pages/users/edit-user/edit-user-resolver';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './shared/layout/layout.component' ).then( m => m.LayoutComponent ),
    runGuardsAndResolvers: 'paramsChange',
    // component: LayoutComponent,
    canActivate: [( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) =>
      inject( AuthGuardService ).canActivate( route, state )],
    canActivateChild: [( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) =>
      inject( AuthGuardService ).canActivateChild( route, state )],
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'hotel-setup', component: HotelSetupComponent
      },
      { path: 'chat', component: ChatComponent },
      {
        path: 'logout',
        component: LoginComponent
      },
      { path: 'join-room', component: JoinRoomComponent },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'country',
        loadComponent: () => import( './pages/masters/country/country.component' ).then( m => m.CountryComponent ),
        children: [
          {
            path: 'add',
            loadComponent: () => import( './pages/masters/country/add-country/add-country.component' ).then( m => m.AddCountryComponent ),
          },
          {
            path: 'edit/:country-id',
            loadComponent: () => import( './pages/masters/country/edit-country/edit-country.component' ).then( m => m.EditCountryComponent ),
          },
          {
            path: '',
            loadComponent: () => import( './pages/masters/country/country-list/country-list.component' ).then( m => m.CountryListComponent ),
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
            path: '',
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
            path: '',
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
            path: '',
            loadComponent: () => import( './pages/masters/room/room-list/room-list.component' ).then( m => m.RoomListComponent ),
          }
        ]
      },
      {
        path: 'guest',
        // resolve: {data: guestDataResolver},
        data: { breadcrumb: 'guest' },
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
      },
      {
        path: 'report',
        data: { breadcrumb: 'reports' },
        loadComponent: () => import( './pages/reports/gst-report/gst-report.component' ).then( m => m.GstReportComponent ),
        children: [
          {
            path: 'gst-report',
            loadComponent: () => import( './pages/reports/gst-report/gst-report.component' ).then( m => m.GstReportComponent ),
            title: 'GST Report',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'restaurant',
        loadComponent: () => import( './pages/restaurant/restaurant.component' ).then( m => m.RestaurantComponent ),
        children: [
          {
            path: 'category',
            loadComponent: () => import( './pages/restaurant/category/category.component' ).then( m => m.CategoryComponent ),
            children: [
              {
                path: '',
                loadComponent: () => import( './pages/restaurant/category/category-list/category-list.component' ).then( m => m.CategoryListComponent ),
              },
              {
                path: 'add',
                loadComponent: () => import( './pages/restaurant/category/add-category/add-category.component' ).then( m => m.AddCategoryComponent ),
              },
              {
                path: 'edit/:id',
                loadComponent: () => import( './pages/restaurant/category/edit-category/edit-category.component' ).then( m => m.EditCategoryComponent )
              },
            ]
          },
          {
            path: 'menu',
            loadComponent: () => import( './pages/restaurant/menu-items/menu-items.component' ).then( m => m.MenuItemsComponent ),
            children: [
              {
                path: '',
                loadComponent: () => import( './pages/restaurant/menu-items/menu-item-list/menu-item-list.component' ).then( m => m.MenuItemListComponent ),
              },
              {
                path: 'add',
                loadComponent: () => import( './pages/restaurant/menu-items/add-menu-item/add-menu-item.component' ).then( m => m.AddMenuItemComponent ),
              },
              {
                path: 'edit/:item-id',
                loadComponent: () => import( './pages/restaurant/menu-items/edit-menu-item/edit-menu-item.component' ).then( m => m.EditMenuItemComponent )
              },
            ]
          },
          {
            path: 'table',
            loadComponent: () => import( './pages/restaurant/rtables/rtables.component' ).then( m => m.RTablesComponent ),
            children: [
              {
                path: '',
                loadComponent: () => import( './pages/restaurant/rtables/rtables-list/rtables-list.component' ).then( m => m.RTablesListComponent ),
              },
              {
                path: 'add',
                loadComponent: () => import( './pages/restaurant/rtables/add-rtables/add-rtables.component' ).then( m => m.AddRTablesComponent ),
              },
              {
                path: 'edit/:table-id',
                loadComponent: () => import( './pages/restaurant/rtables/edit-rtables/edit-rtables.component' ).then( m => m.EditRTablesComponent )
              },
            ]
          },
          {
            path: 'dashboard',
            loadComponent: () => import( './pages/restaurant/rdashboard/rdashboard.component' ).then( m => m.RDashboardComponent ),
          }
        ],

      },

    ]
  },
  {
    path: 'login',
    loadComponent: () => import( './pages/login/login.component' ).then( m => m.LoginComponent ),
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '**', redirectTo: '/login' }
];
