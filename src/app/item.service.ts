// src/app/item.service.ts
import { Injectable } from '@angular/core';

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  getItems(): CartItem[] {
    return [
      { title: 'Malatang', price: 12.99, quantity: 1, imageUrl: 'https://hanjubapsang.com.au/wp-content/uploads/2023/01/14618253038_front_59af9f0725.jpg' },
      { title: 'Handpulled Noodles', price: 10.99, quantity: 1, imageUrl: 'https://lindseyeatsla.com/wp-content/uploads/2022/02/Lindsey_Eats_Sichuan_Spicy_Noodles-5.jpg' },
      { title: 'Steamed Rice', price: 2.55, quantity: 1, imageUrl:'https://thewanderlustkitchen.com/wp-content/uploads/2013/12/Perfect-White-Rice-Recipe-Redo-17.jpg'},
      { title: 'Master Kong Tea', price: 2.99, quantity: 1, imageUrl: 'https://assets.woolworths.com.au/images/1005/1074638754.jpg?impolicy=wowsmkqiema&w=600&h=600' }
    ];
  }
}
