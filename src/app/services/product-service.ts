// src/app/services/product-service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Product } from '../model/product'; 
import { environment } from '../../environments/environment';

@Injectable({
 providedIn: 'root'
})
export class ProductService {

 private url: string = `${environment.HOST}/products`; // URL base: /products
 private productChange = new Subject<Product[]>();
 private messageChange = new Subject<string>();

 constructor(private http: HttpClient) { }

 // 1. Obtiene la lista completa de productos
 findAll(): Observable<Product[]> {
  return this.http.get<Product[]>(this.url);
 }

 // 2. Obtiene un producto por su ID
 findById(id: number): Observable<Product> {
  // Usa GET a /products/{id}
  return this.http.get<Product>(`${this.url}/${id}`);
 }

 // 3. Crea un nuevo producto
 save(product: Product): Observable<Product> {
  // Usa POST a /products
  return this.http.post<Product>(this.url, product);
 }

 // 4. Actualiza un producto existente
 update(id: number, product: Product): Observable<Product> {
  // Usa PUT a /products/{id}
  return this.http.put<Product>(`${this.url}/${id}`, product);
 }

 // 5. Elimina un producto por su ID
 delete(id: number): Observable<any> {
  // Usa DELETE a /products/{id}
  return this.http.delete(`${this.url}/${id}`);
 }

 // Métodos para comunicación entre componentes (Subject/Observable)
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
}