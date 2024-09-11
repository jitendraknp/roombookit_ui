import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArrayName, FormBuilder, FormControl, FormGroup, FormGroupName, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { trashOutline, saveOutline } from "ionicons/icons";

@Component( {
  selector: 'app-more-guest',
  standalone: true,
  imports: [IonIcon, NgSelectModule, CommonModule, ReactiveFormsModule, IonIcon],
  templateUrl: './more-guest.component.html',
  styleUrl: './more-guest.component.css'
} )
export class MoreGuestComponent implements OnInit {
  @Input() ctrl!: any;
  @Input() recordNo!: number;
  @Input() guestForm!: any;
  @Output() removeUser = new EventEmitter<number>();
  // @Input() formGroupName!: FormGroupName;formArrayName
  constructor( private fb: FormBuilder ) {
    addIcons( { trashOutline } );
  }
  ngOnInit (): void {
    let fc = this.guestForm as FormGroup;
  }
  onDelete () {
    this.removeUser.emit( 1 );
  }
}
