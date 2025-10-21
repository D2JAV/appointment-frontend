import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../model/patient';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// http://locahost:9090/patients
// http://localhost:9090/medic

export class PatientService {

  constructor (private http: HttpClient){}

  private url: string =  `${environment.HOST}/patients`; 
  private patientChange: Subject<Patient[]> = new Subject<Patient[]>;
  private messageChange: Subject<string> = new Subject<string>;

  findAll(){
    // return this.http.get(this.url);
    return this.http.get<Patient[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Patient>(`${this.url}/${id}`);
  }

  save(patient: Patient){
    return this.http.post(this.url, patient);
  }

  update(id: number, patient: Patient){
    return this.http.put(`${this.url}/${id}`, patient);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  ////////////////////
  setPatientChange(data: Patient[]){
    this.patientChange.next(data);
  }

  getPatientChange(){
    return this.patientChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
