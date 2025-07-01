import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { NotificationService } from '../../core/services/notification.service';
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  passwordPattern =
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$';

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private _storageService: StorageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;

    if (this.loginForm.invalid) {
      this._notificationService.error('Invalid form');
      this.isSubmitting = false;
      return;
    }

    this._authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this._notificationService.success(response.message);
          debugger
          // Store user + token
          this._storageService.setAuth({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            token: response.data.token,
          });

          // Optional: redirect or do something next
          this.router.navigate(['/home']);
        } else {
          this._notificationService.error(response.message);
          this.isSubmitting = false;
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
        this.isSubmitting = false;
      },
    });
  }
}
