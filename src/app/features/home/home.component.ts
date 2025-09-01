import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  featuredCategories = [
    {
      id: 1,
      name: 'Electronics',
      imageUrl:
        'https://app.imgforce.com/images/user/I0L_1611618012_soap-4.jpg',
    },
    {
      id: 2,
      name: 'Clothing',
      imageUrl: 'https://via.placeholder.com/300x200?text=Clothing',
    },
    {
      id: 3,
      name: 'Home & Kitchen',
      imageUrl: 'https://via.placeholder.com/300x200?text=Home+%26+Kitchen',
    },
  ];

  featuredProducts = [
    {
      id: 101,
      name: 'Smartphone',
      price: 299.99,
      imageUrl: 'https://via.placeholder.com/300x200?text=Smartphone',
    },
    {
      id: 102,
      name: 'Running Shoes',
      price: 59.99,
      imageUrl: 'https://via.placeholder.com/300x200?text=Shoes',
    },
    {
      id: 103,
      name: 'Blender',
      price: 89.99,
      imageUrl: 'https://via.placeholder.com/300x200?text=Blender',
    },
    {
      id: 104,
      name: 'Headphones',
      price: 39.99,
      imageUrl: 'https://via.placeholder.com/300x200?text=Headphones',
    },
  ];
}
