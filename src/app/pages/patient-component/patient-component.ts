import { Component, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient-service';
import { Patient } from '../../model/patient';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './patient-component.html',
  styleUrl: './patient-component.css',
})
export class PatientComponent {
  // patients: Patient[];
  dataSource: MatTableDataSource<Patient>;
  // displayedColumns: string[] = ['idPatient','dni', 'firstName', 'lastName','phone','email','address'];
  columnsDefinitions = [
    { def: 'idPatient', label: 'idPatient', hide: true },
    { def: 'dni', label: 'dni', hide: false },
    { def: 'firstName', label: 'firstName', hide: false },
    { def: 'lastName', label: 'lastName', hide: false },
    { def: 'phone', label: 'phone', hide: false },
    { def: 'email', label: 'email', hide: false },
    { def: 'address', label: 'address', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private patientService: PatientService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.patientService.findAll().subscribe(data => console.log(data));
    // this.patientService.findAll().subscribe(data => this.patients = data);

    /*this.patientService.findAll().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });*/
    this.patientService.findAll().subscribe(data => this.createTable(data));
    this.patientService.getPatientChange().subscribe(data => this.createTable(data));
    this.patientService.getMessageChange().subscribe(data => 
      this._snackBar.open(data, 'INFO', { 
        duration: 2000, 
        horizontalPosition: 'right', 
        verticalPosition:'bottom'
      })
    );
  }

  createTable(data: Patient[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number){
    this.patientService.delete(id)
    .pipe(switchMap(()=>this.patientService.findAll()))
    .subscribe( data => {
      this.patientService.setPatientChange(data);
      this.patientService.setMessageChange('PATIENT DELETED!');
    });
  }
}
