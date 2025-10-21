 

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Laboratory } from '../model/laboratory';  

@Injectable({
  providedIn: 'root'
})
export class LaboratoryService { 


  private url: string =  `${environment.HOST}/laboratories`; 

  constructor (private http: HttpClient){}
 
  findAll(){
    return this.http.get<Laboratory[]>(this.url);
  }
}