// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Product } from '../model/product'; // Importa el modelo creado

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url: string = 'http://localhost:8080/products'; // Ajusta la URL base
  private productChange = new Subject<Product[]>();
  private messageChange = new Subject<string>();

  constructor(private http: HttpClient) { }

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Métodos para comunicación entre componentes (similares al de Patient)
  getProductChange(): Observable<Product[]> {
    return this.productChange.asObservable();
  }

  setProductChange(products: Product[]) {
    this.productChange.next(products);
  }

  getMessageChange(): Observable<string> {
    return this.messageChange.asObservable();
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }

  // Puedes añadir findById, save, update
}