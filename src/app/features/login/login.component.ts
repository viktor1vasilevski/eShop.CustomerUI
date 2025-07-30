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
import { ActivatedRoute, Router } from '@angular/router';
import { BasketService } from '../../core/services/basket.service';
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
    private _storageService: StorageService,
    private router: Router,
    private _basketService: BasketService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
    });

    this.route.queryParams.subscribe((params) => {
      debugger;
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
    debugger;
    this._authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        debugger
        this._notificationService.success(response.message);
        this._storageService.setAuth({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          token: response.data.token,
        });

        const afterLogin = () => {
          debugger
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
        debugger
        const guestBasket = this._basketService.getGuestBasket();
        const userId = this._storageService.getUserId();

        const cart = guestBasket.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        this._basketService.mergeGuestBasketToBackend(userId, cart).subscribe({
          complete: afterLogin,
        });
        this.isSubmitting = false;
      },
      error: (errorResponse: any) => {
        this.isSubmitting = false;
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }
}
