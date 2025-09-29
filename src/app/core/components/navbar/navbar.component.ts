import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BasketService } from '../../services/basket.service';
import { BasketStorageService } from '../../services/basket.storage.service';
import { AuthStorageService } from '../../services/auth.storage.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  basketItemCount: number = 0;
  userEmail: string | null = null;
  isCustomerLoggedIn: boolean = false;
  private authSubscription!: Subscription;
  private subscription?: Subscription;

  constructor(
    private _categoryService: CategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _authService: AuthService,
    private _authStorageService: AuthStorageService,
    private _notificationService: NotificationService,
    private _basketService: BasketService,
    private _basketStorageService: BasketStorageService
  ) {}

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.loadCategoriesWithSubcategoriesForMenu();
    this._authStorageService.currentUser$.subscribe((user) => {
      this.userEmail = user?.email || null;
    });

    this._basketStorageService.distinctItemCount$.subscribe((count) => {
      this.basketItemCount = count;
    });

    this._authStorageService.isCustomerLoggedIn$.subscribe((status) => {
      this.isCustomerLoggedIn = status;
    });
  }

  loadCategoriesWithSubcategoriesForMenu(): void {
    this._categoryService.getCategoriesWithSubcategoriesForMenu().subscribe({
      next: (response: any) => {
        this.categories = response.data;
        console.log(this.categories);
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  logout() {
    this._authStorageService.logout();
    this._basketStorageService.clearLocalBasket();
  }
}
