import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  passwordPattern =
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$';
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+$';

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router //private _notificationService: NotificationService, //private _errorHandlerService: ErrorHandlerService,
  ) //private _authService: AuthService // assumed service to register
  {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
    });
  }

  onSubmit() {
    debugger
    if (!this.registerForm.valid) {
      //this._notificationService.info('Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        console.log(response);
        
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
        
      }
    })
  }
}
