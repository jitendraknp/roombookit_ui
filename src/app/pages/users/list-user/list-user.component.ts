import { Component, Input, ViewEncapsulation } from '@angular/core';
import { User } from '../../../models/user';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';


@Component( {
  selector: 'app-list-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FluidModule,
    TooltipModule,
    ToastModule
  ],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css',
  encapsulation: ViewEncapsulation.None
} )
export class ListUserComponent {
  @Input() users!: User;
}
