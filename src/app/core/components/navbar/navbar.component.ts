import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  categories: any[] = [];
  constructor(private _categoryService: CategoryService) {}

  ngOnInit(): void {
    this._categoryService.getCategoriesWithSubcategoriesForMenu().subscribe({
      next: (response: any) => {
        this.categories = response.data;
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      },
    });
  }
}
