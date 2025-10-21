import { Component } from '@angular/core';
import { Medic } from '../../model/medic';
import { MedicService } from '../../services/medic-service';

@Component({
  selector: 'app-medic',
  imports: [],
  templateUrl: './medic-component.html',
  styleUrl: './medic-component.css'
})
export class MedicComponent {
  medics: Medic[];

  constructor(private medicService: MedicService){}

  ngOnInit():void{
     this.medicService.findAll().subscribe(data => this.medics = data); 
  }
}
