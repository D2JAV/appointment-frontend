 

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category'; // Usamos el modelo completo

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
   
  private url: string =  `${environment.HOST}/categories`; 

  constructor (private http: HttpClient){} 
  
  findAll(){
    return this.http.get<Category[]>(this.url);
  }
}