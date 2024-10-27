import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NoRecordsFoundComponent } from '../no-records-found/no-records-found.component';
import { ListUserComponent } from './list-user/list-user.component';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../models/response';
import { User } from '../../models/user';
import { NgSelectModule } from '@ng-select/ng-select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';

@Component( {
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    NgSelectModule,
    FloatLabelModule,
    AutoCompleteModule,
    BadgeModule,
    ListUserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
} )
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  users$!: Observable<ApiResponse>;
  message!: string;
  p: number = 1;
  public filter: string = '';
  bodyText = 'This text can be updated in modal 1';

  constructor( private route: ActivatedRoute ) {
  }

  ngOnInit (): void {
    this.route.data.subscribe( ( { user } ) => {
      this.users = user.Data;
    } );
    // this.users$ = this.userService.getAll();
    // this.users$.subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     this.users = data.Data;
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   }
    // });
  }

  ngOnDestroy (): void {
    // this.users$.subscribe().unsubscribe();
  }
}
