// src/app/dialogs/confirm-dialog.component.ts

import { Component } from '@angular/core'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; 
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
  MatDialogModule],
  template: `
    <h2 mat-dialog-title>Confirmación</h2>
    <div mat-dialog-content>
      ¿Estás seguro de que deseas eliminar este registro?
    </div>
    <div mat-dialog-actions class="dialog-actions-end">
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>Sí, Eliminar</button>
    </div>
  `,
  // Puedes dejar styleUrl vacío o usar un estilo simple
})
export class ConfirmDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  onNoClick(): void {
    // Cuando se hace clic en 'No', cerramos el diálogo y devolvemos 'false'
    this.dialogRef.close(false);
  }
}