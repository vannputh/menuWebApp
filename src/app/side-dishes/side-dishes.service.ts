import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SideDish } from './side-dishes.interface';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SideDishesService {
  private apiUrl = environment.apiUrl + '/side-dishes';

  constructor(private http: HttpClient) {}

  getSideDishes(): Observable<SideDish[]> {
    return this.http.get<SideDish[]>(this.apiUrl);
  }
}
