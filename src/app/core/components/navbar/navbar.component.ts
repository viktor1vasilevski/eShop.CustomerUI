import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

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
  ) {}

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.loadCategoriesWithSubcategoriesForMenu();


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

  getUserEmail(): void {
    //const auth = this._storageService.getAuth();
    //this.userEmail = auth?.email ?? null;
  }

  logout() {
    //this._storageService.clearAuth();
    //this.router.navigate(['/home']);
  }
}
