import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Patient } from '../../../model/patient';
import { PatientService } from '../../../services/patient-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-edit-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './patient-edit-component.html',
  styleUrl: './patient-edit-component.css',
})
export class PatientEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // Conocer el parametro que viene por la url
    private patientService: PatientService,
    private router: Router // Dirigirnos de un componente a otro
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(),
      dni: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      address: new FormControl(''),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.patientService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idPatient: new FormControl(data.idPatient),
          dni: new FormControl(data.dni),
          firstName: new FormControl(data.firstName),
          lastName: new FormControl(data.lastName),
          phone: new FormControl(data.phone),
          email: new FormControl(data.email),
          address: new FormControl(data.address),
        });
      });
    }
  }

  persist() {
    const patient: Patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.dni = this.form.value['dni'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];
    patient.address = this.form.value['address'];

    if(this.isEdit){
      // UPDATE
      // this.patientService.update(this.id, patient).subscribe();
      // PRACTICA COMUN, NO IDEAL
      this.patientService.update(this.id, patient).subscribe(() => {
        this.patientService.findAll().subscribe( data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('PATIENT UPDATED!');
        })
      });
    }else{
      // SAVE
      //this.patientService.save(patient).subscribe();
      // PRACTICA IDEAL
      this.patientService.save(patient)
        .pipe(switchMap( () => this.patientService.findAll()))
        .subscribe( data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('PATIENT CREATED!');
        });
    }

    this.router.navigate(['pages/patient']);
  }
}
