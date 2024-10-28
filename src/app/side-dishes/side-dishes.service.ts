import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SideDish } from './side-dishes.interface';

@Injectable({
  providedIn: 'root'
})
export class SideDishesService {
  private apiUrl = 'http://localhost:3000/api/side-dishes';

  constructor(private http: HttpClient) {}

  getSideDishes(): Observable<SideDish[]> {
    return this.http.get<SideDish[]>(this.apiUrl);
  }
}
