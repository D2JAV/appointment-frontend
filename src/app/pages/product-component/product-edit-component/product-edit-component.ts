// src/app/pages/product/product-edit/product-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common'; // Para el pipe async en el template

import { Product } from '../../../model/product';
import { Category } from '../../../model/category';
import { Family } from '../../../model/family';
import { Laboratory } from '../../../model/laboratory';
import { ProductService } from '../../../services/product-service'; // Asegúrate de tener este servicio
import { CategoryService } from '../../../services/category-service'; // Necesario para el desplegable
import { FamilyService } from '../../../services/family-service'; // Necesario para el desplegable
import { LaboratoryService } from '../../../services/laboratory-service'; // Necesario para el desplegable
import { Observable, forkJoin } from 'rxjs'; // Necesario para cargar listas

@Component({
  selector: 'app-product-edit-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSelectModule, // Para las listas desplegables
    MatDatepickerModule, // Para el selector de fecha
    MatNativeDateModule, // Necesario para MatDatepickerModule
  ],
  templateUrl: './product-edit-component.html',
  styleUrl: './product-edit-component.css',
})
export class ProductEditComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isEdit: boolean = false;

  categories$!: Observable<Category[]>;
  families$!: Observable<Family[]>;
  laboratories$!: Observable<Laboratory[]>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService, // Inyectar servicio de Categoría
    private familyService: FamilyService, // Inyectar servicio de Familia
    private laboratoryService: LaboratoryService, // Inyectar servicio de Laboratorio
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Inicializar el formulario con validaciones
    this.form = new FormGroup({
      idProduct: new FormControl(0),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required]),
      presentation: new FormControl('', [Validators.required]),
      unitPrice: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      expired: new FormControl(new Date(), [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      family: new FormControl(null, [Validators.required]),
      laboratory: new FormControl(null, [Validators.required]),
    });

    // 2. Cargar datos para los Selects
    this.loadSelectOptions();

    // 3. Obtener el ID de la URL y determinar si es edición
    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }
  
  // Función para cargar los Observables de las listas
  loadSelectOptions() {
    this.categories$ = this.categoryService.findAll(); // Asume que CategoryService tiene findAll()
    this.families$ = this.familyService.findAll();
    this.laboratories$ = this.laboratoryService.findAll();
  }

  initForm() {
    if (this.isEdit) {
      // Usar forkJoin para cargar el producto y las listas de selects antes de rellenar el formulario
      // Aunque en este caso, solo necesitamos el producto ya que las listas ya están cargadas en loadSelectOptions()
      this.productService.findById(this.id).subscribe((data) => {
        // Formatear la fecha para que sea compatible con MatDatepicker (espera un objeto Date)
        const expiredDate = data.expired ? new Date(data.expired) : null;

        this.form = new FormGroup({
          idProduct: new FormControl(data.idProduct),
          name: new FormControl(data.name, [Validators.required, Validators.minLength(3)]),
          description: new FormControl(data.description, [Validators.required]),
          presentation: new FormControl(data.presentation, [Validators.required]),
          unitPrice: new FormControl(data.unitPrice, [Validators.required, Validators.min(0.01)]),
          stock: new FormControl(data.stock, [Validators.required, Validators.min(0)]),
          expired: new FormControl(expiredDate, [Validators.required]),
          // Al editar, se selecciona el objeto completo de la entidad anidada
          category: new FormControl(data.category, [Validators.required]),
          family: new FormControl(data.family, [Validators.required]),
          laboratory: new FormControl(data.laboratory, [Validators.required]),
        });
      });
    }
  }

  // Se necesita una función de comparación para los objetos en MatSelect
  compareObject(obj1: any, obj2: any): boolean {
    // Esto asume que Category, Family y Laboratory tienen un campo 'id'
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  persist() {
    if (this.form.invalid) {
        // Opcional: mostrar un mensaje o marcar campos con error
        return; 
    }
    // 1. Obtener los valores del formulario
    const formValues = this.form.value;
// Obtener el objeto Date y formatearlo a 'YYYY-MM-DD'
    const expiredDate: Date = formValues.expired;
    let formattedExpiredDate: string | null = null;

    if (expiredDate) {
        // toISOString genera algo como "2025-10-21T16:10:30.000Z"
        // slice(0, 10) extrae solo la parte "2025-10-21"
        formattedExpiredDate = expiredDate.toISOString().slice(0, 10);
    }

    // 2. Mapear los valores a la estructura DTO esperada por el backend
    //    Aquí es donde extraemos solo los IDs de los objetos Category, Family y Laboratory.
    const productDTOToSend = {
        idProduct: null,
        name: formValues.name,
        description: formValues.description,
        presentation: formValues.presentation,
        unitPrice: formValues.unitPrice,
        stock: formValues.stock,
        expired: formattedExpiredDate,
        
        // ¡LA SOLUCIÓN! Extraer solo el ID.
        idCategory: formValues.category ? formValues.category.idCategory : null,
        idFamily: formValues.family ? formValues.family.idFamily : null,
        idLaboratory: formValues.laboratory ? formValues.laboratory.idLaboratory : null,
    };
if (this.isEdit) {
      // ACTUALIZAR (usamos productDTOToSend)
      this.productService.update(this.id, productDTOToSend as any) // Casteamos como 'any' si ProductService espera 'Product'
        .pipe(switchMap(() => this.productService.findAll()))
        .subscribe(data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('PRODUCTO ACTUALIZADO!');
        });
    } else {
      // CREAR (usamos productDTOToSend)
      this.productService.save(productDTOToSend as any) // Casteamos como 'any'
        .pipe(switchMap(() => this.productService.findAll()))
        .subscribe(data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('PRODUCTO CREADO!');
        });
    }

    this.router.navigate(['/pages/product']);
}
}