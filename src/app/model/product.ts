// src/app/model/product.ts (o product-dto.ts si usas DTOs en el frontend)
import { Category } from './category'; // Asumiendo que también tienes modelos para Category, Family, Laboratory
import { Family } from './family';
import { Laboratory } from './laboratory';

export interface Product {
  idProduct: number;
  name: string;
  description: string;
  presentation: string;
  unitPrice: number;
  stock: number;
  expired: Date; // Usar Date si se maneja como objeto, o string si se maneja como string ISO
  category: Category; // O solo el ID y nombre si es para la tabla
  family: Family;
  laboratory: Laboratory;
}
 