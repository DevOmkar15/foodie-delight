import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import {
  HttpClientInMemoryWebApiModule,
  httpClientInMemBackendServiceFactory,
} from 'angular-in-memory-web-api';
import { MockData } from 'src/app/mock-data';

@Component({
  standalone: true,
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
  ],
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  displayedColumns: string[] = ['name', 'description', 'location', 'actions'];

  constructor(
    private restaurantService: RestaurantService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => (this.restaurants = data),
      error: (error) => console.error(error),
    });
  }

  deleteRestaurant(id: number): void {
    this.dialog
      .open(ConfirmComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.restaurantService.deleteRestaurant(id).subscribe({
            next: () => this.loadRestaurants(),
            error: (error) => console.error(error),
          });
        }
      });
  }
}
