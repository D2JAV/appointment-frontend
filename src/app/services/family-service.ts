 

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Family } from '../model/family';  

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
    
  private url: string =  `${environment.HOST}/families`; 

  constructor (private http: HttpClient){}
 
  findAll(){
    return this.http.get<Family[]>(this.url);
  }
}