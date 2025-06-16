import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laptop } from '../models/laptop.model';

@Injectable({
  providedIn: 'root'
})
export class LaptopService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAllLaptops(): Observable<Laptop[]> {
    return this.http.get<Laptop[]>(`${this.apiUrl}/laptops`);
  }

  getLaptopById(id: string): Observable<Laptop> {
    return this.http.get<Laptop>(`${this.apiUrl}/laptops/${id}`);
  }
}
