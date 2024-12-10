import { Injectable } from '@angular/core';

interface CartItem {
  toppings: any;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;

}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
}
