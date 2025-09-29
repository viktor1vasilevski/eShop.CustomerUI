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
import { BasketService } from '../../core/services/basket.service';
import { NotificationType } from '../../core/enums/notification-type.enum';
import { BasketStorageService } from '../../core/services/basket.storage.service';
import { AuthStorageService } from '../../core/services/auth.storage.service';

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
    private _authStorageService: AuthStorageService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private _basketService: BasketService,
    private _basketStorageService: BasketStorageService,
    private router: Router
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
      this.isSubmitting = false;
      return;
    }

    this._authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this._notificationService.notify(
          response.notificationType,
          response.message
        );
        debugger;
        let userId = response.data.id;
        this._authStorageService.saveUser(response.data);
        this._authStorageService.isCusLoggedIn(true);

        const localItems = this._basketStorageService.getLocalBasketItems();
        if (localItems.length > 0) {
          this.updateUserBasket(userId, localItems);
          this._notificationService.notify(
            NotificationType.Info,
            'baslet items merged!'
          );
        } else {
          this.loadBackendBasket(userId);
        }
      },
      error: (errorResponse: any) => {
        this.isSubmitting = false;
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  // helper for backend-only load
  private loadBackendBasket(userId: string) {
    this._basketService.getBasketByUserId(userId).subscribe({
      next: (basketResponse: any) => {
        this._basketStorageService.setBasketItems(
          basketResponse.data.items || []
        );
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this._basketStorageService.setBasketItems([]);
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
    });
  }

  private updateUserBasket(userId: string, localItems: any) {
    const request = { items: localItems };

    this._basketService.updateUserBasket(userId, request).subscribe({
      next: () => {
        this.loadBackendBasket(userId);
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.loadBackendBasket(userId);
      },
    });
  }
}
