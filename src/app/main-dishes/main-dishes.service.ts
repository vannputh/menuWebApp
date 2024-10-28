// src/app/main-dishes/main-dishes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainDish } from './main-dishes.interface';

@Injectable({
  providedIn: 'root'
})
export class MainDishesService {
  private apiUrl = 'http://localhost:3000/api/main-dishes';

  constructor(private http: HttpClient) {}

  getMainDishes(): Observable<MainDish[]> {
    return this.http.get<MainDish[]>(this.apiUrl);
  }
}
