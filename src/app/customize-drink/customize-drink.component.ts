import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customize-drink',
  templateUrl: './customize-drink.component.html',
  standalone: true,
  styleUrls: ['./customize-drink.component.scss']
})
export class CustomizeDrinkComponent implements OnInit {
  drink: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.drink = navigation?.extras.state?.['drink'];
  }

  ngOnInit(): void {}

  addToCart() {

  }
}
