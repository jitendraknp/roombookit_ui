import { Component, Input, OnInit } from '@angular/core';
import { States } from '../../../../models/states';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-state-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.css'
})
export class StateListComponent {

  @Input() stateDetail!: States;
}
