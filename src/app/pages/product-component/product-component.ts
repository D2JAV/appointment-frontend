import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';  
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product-service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog';

 
@Component({
  selector: 'app-product',
  standalone: true, 
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
    MatDialogModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class ProductComponent implements OnInit {

  dataSource!: MatTableDataSource<Product>;
  columnsDefinitions = [
    { def: 'idProduct', label: 'ID', hide: true },
    { def: 'name', label: 'NOMBRE', hide: false },
    { def: 'descripcion', label: 'DESCRIPCION', hide: false },
    { def: 'presentation', label: 'PRESENTACIÓN', hide: false },
    { def: 'unitPrice', label: 'PRECIO UNITARIO', hide: false },
    { def: 'stock', label: 'STOCK', hide: false },
    { def: 'expired', label: 'FECHA EXP.', hide: false },
    { def: 'categoryName', label: 'CATEGORÍA', hide: false },
    { def: 'familyName', label: 'FAMILIA', hide: false },
    { def: 'laboratoryName', label: 'LABORATORIO', hide: false },
    { def: 'actions', label: 'ACCIONES', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // 1. Carga inicial de datos
    this.productService.findAll().subscribe(data => this.createTable(data));

    // 2. Suscripción a cambios de datos (después de crear/editar/eliminar)
    this.productService.getProductChange().subscribe(data => this.createTable(data));

    // 3. Suscripción a mensajes de notificación (snack bar)
    this.productService.getMessageChange().subscribe(data =>
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    );
  }
  createTable(data: Product[]) {
    this.dataSource = new MatTableDataSource(data);

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.dataSource.filterPredicate = (data: Product, filter: string) => {
      const dataStr = Object.keys(data).reduce((currentTerm, key) => {
        if (key === 'category' && data.category && (data.category as any).name) {
          return currentTerm + (data.category as any).name + ' ';
        }
        if (key === 'family' && data.family && (data.family as any).name) {
          return currentTerm + (data.family as any).name + ' ';
        }
        if (key === 'laboratory' && data.laboratory && (data.laboratory as any).name) {
          return currentTerm + (data.laboratory as any).name + ' ';
        }
        return currentTerm + (data as any)[key] + ' ';
      }, '').toLowerCase();

      return dataStr.indexOf(filter) !== -1;
    }
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number){
    // 1. Abrir el modal de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px', 
    });

    // 2. Suscribirse al cierre del modal
    dialogRef.afterClosed().subscribe(result => {
      // result será 'true' si presionó 'Sí, Eliminar' o 'false' si presionó 'No'
      if (result) { 
        // 3. Si confirma, proceder con la eliminación
        this.productService.delete(id)
        .pipe(switchMap(()=>this.productService.findAll())) 
        .subscribe( data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('PRODUCTO ELIMINADO!');
        });
      }
    });
  }
}