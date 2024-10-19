import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArrayName, FormBuilder, FormControl, FormGroup, FormGroupName, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: 'app-more-guest',
  standalone: true,
  imports: [
    NgSelectModule,
    CommonModule,
    ReactiveFormsModule,
    TooltipModule],
  templateUrl: './more-guest.component.html',
  styleUrl: './more-guest.component.css'
})
export class MoreGuestComponent implements OnInit {
  @Input() ctrl!: any;
  @Input() recordNo!: number;
  @Input() guestForm!: any;
  @Output() removeUser = new EventEmitter<number>();

  // @Input() formGroupName!: FormGroupName;formArrayName
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    let fc = this.guestForm as FormGroup;
  }

  onDelete() {
    this.removeUser.emit(1);
  }
}
