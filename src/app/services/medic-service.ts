import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Medic } from '../model/medic';

@Injectable({
  providedIn: 'root'
})
export class MedicService {
  private url: string =  `${environment.HOST}/medics`; 

  constructor (private http: HttpClient){}

  findAll(){;
      return this.http.get<Medic[]>(this.url);
    }

}
