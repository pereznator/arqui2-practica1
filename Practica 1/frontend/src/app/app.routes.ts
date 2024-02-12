import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IngresosEgresosComponent } from './ingresos-egresos/ingresos-egresos.component';
import { VehiculoRolComponent } from './vehiculo-rol/vehiculo-rol.component';
import { TotalPersonasComponent } from './total-personas/total-personas.component';

export const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "ingresos-egresos", component: IngresosEgresosComponent },
  { path: "vehiculo-rol", component: VehiculoRolComponent },
  { path: "total-personas", component: TotalPersonasComponent },
  { path: "**", redirectTo: "home" }
];
