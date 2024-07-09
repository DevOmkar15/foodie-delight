import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  standalone: true,
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class RestaurantFormComponent implements OnInit {
  restaurantForm: FormGroup;
  isEditMode = false;
  restaurantId: number;
  newId: number;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    this.calclatePresentRestaurants();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.restaurantId = +params['id'];
        this.isEditMode = true;
        this.loadRestaurant();
      }
    });
  }

  loadRestaurant(): void {
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe(
      (restaurant) => this.restaurantForm.patchValue(restaurant),
      (error) => console.error(error)
    );
  }

  calclatePresentRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => (this.newId = data.length + 1),
    });
  }

  onSubmit(): void {
    if (this.restaurantForm.invalid) {
      return;
    }

    const restaurant: Restaurant = this.restaurantForm.value;

    if (this.isEditMode) {
      restaurant.id = this.restaurantId;
      this.restaurantService.updateRestaurant(restaurant).subscribe({
        next: () => this.router.navigate(['/restaurants']),
        error: (error) => console.error(error),
      });
    } else {
      restaurant.id = this.newId;
      this.restaurantService.addRestaurant(restaurant).subscribe({
        next: () => this.router.navigate(['/restaurants']),
        error: (error) => console.error(error),
      });
    }
  }
}
