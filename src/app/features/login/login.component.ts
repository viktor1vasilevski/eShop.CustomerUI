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

import { ActivatedRoute, Router } from '@angular/router';

declare var bootstrap: any;

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

  fromModal = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,

    private router: Router,

  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
    });

    this.route.queryParams.subscribe((params) => {

      this.fromModal = params['fromModal'] === 'true';
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

        this._notificationService.success(response.message);


        const afterLogin = () => {

          if (this.fromModal) {
            const modalElement = document.getElementById('loginModal');
            if (modalElement) {
              const modal = bootstrap.Modal.getInstance(modalElement);
              modal?.hide();
            }
          } else {
            this.router.navigate(['/home']);
          }
        };

      },
      error: (errorResponse: any) => {
        this.isSubmitting = false;
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }
}
