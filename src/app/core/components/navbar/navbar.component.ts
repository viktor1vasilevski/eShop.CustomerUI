import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BasketService } from '../../services/basket.service';

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
  private authSubscription!: Subscription;
  private subscription?: Subscription;

  constructor(
    private _categoryService: CategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private router: Router,
    private _authService: AuthService,
    private _basketService: BasketService
  ) {}

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.loadCategoriesWithSubcategoriesForMenu();
    this._authService.currentUser$.subscribe((user) => {
      this.userEmail = user?.email || null;
    });

    this._basketService.distinctItemCount$.subscribe((count) => {
      this.basketItemCount = count;
    });
  }

  loadCategoriesWithSubcategoriesForMenu(): void {
    this._categoryService.getCategoriesWithSubcategoriesForMenu().subscribe({
      next: (response: any) => {
        this.categories = response.data;
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  logout() {
    this._authService.logout();
    this._basketService.clearLocalBasket();
  }
}
