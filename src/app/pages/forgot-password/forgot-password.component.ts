import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
@Component( {
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    ButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None,
} )
export class ForgotPasswordComponent implements OnInit {
  onBack () {
    this.router.navigate( ['/login'] );
  }

  forgotPasswordForm: FormGroup;
  messages: Message[] = [];

  constructor( private fb: FormBuilder, private cdr: ChangeDetectorRef, private router: Router ) {
    this.forgotPasswordForm = this.fb.group( {
      email: new FormControl( '', [Validators.required, Validators.email] )
    } );
  }
  ngOnInit (): void {

  }

  get email () {
    return this.forgotPasswordForm.get( 'email' );
  }

  onSubmit () {
    if ( this.forgotPasswordForm.valid ) {
      const email = this.forgotPasswordForm.value.email;

      // Simulate a password reset request
      console.log( 'Sending password reset email to:', email );

      // Reset form and show success message
      this.messages = [
        { severity: 'success', summary: 'Success', detail: 'Password reset link sent to your email.' },
      ];
      this.forgotPasswordForm.reset();
    } else {
      // Show error message if form is invalid
      this.messages = [
        { severity: 'error', summary: 'Error', detail: 'Please enter a valid email address.' },
      ];
    }
  }
}
