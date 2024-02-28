import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AppService } from '../app.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Observable, Subscription, catchError, interval, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [AppService]
})
export class HomeComponent implements OnInit, OnDestroy {
  
  loading: boolean = true;
  espaciosOcupadosChart: Chart<"doughnut">;
  personasPorVehiculoChart: Chart<"doughnut">;
  vehiculosPorRolChart: Chart<"doughnut">;

  espaciosOcupadosDataset: number[];
  personasPorVehiculoDataset: number[];
  vehiculosPorRolDataset: number[];
  entradasDataset: any[];
  salidasDataset: any[];

  timerSubscription: Subscription;

  constructor(private appService: AppService) {
    
  }
  
  ngOnInit(): void {
    if (this.espaciosOcupadosChart) {
      this.espaciosOcupadosChart.destroy();
    }
    if (this.personasPorVehiculoChart) {
      this.personasPorVehiculoChart.destroy();
    }
    if (this.vehiculosPorRolChart) {
      this.vehiculosPorRolChart.destroy();
    }
    this.actualizarDatos().subscribe();
    this.timerSubscription = interval(5000)
    .pipe(
      switchMap(() => this.actualizarDatos())
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  actualizarDatos(): Observable<any> {
    this.loading = true;
    return this.appService.dashboarEspaciosOcupados().pipe(
      switchMap(resp1 => {
        this.espaciosOcupadosDataset = [resp1[0].Ocupados, resp1[0].Libres];
        this.setEspaciosOcupadosChart();
        return this.appService.dashboardPersonasPorVehiculo();
      }),
      catchError(err => {
        console.log(err);
        return this.appService.dashboardPersonasPorVehiculo();
      }),
      switchMap(resp2 => {
        this.personasPorVehiculoDataset = [resp2[0].Personal, resp2[0].Mediano, resp2[0].Grande];
        this.setPersonasPorVehiculoChart();
        return this.appService.dashboardVehiculosPorRol();
      }),
      catchError(err => {
        console.log(err);
        return this.appService.dashboardVehiculosPorRol();
      }),
      switchMap(resp3 => {
        this.vehiculosPorRolDataset = [resp3[0].Ajenos, resp3[0].Estudiantes, resp3[0].Trabajador, resp3[0].Catedratico];
        this.setVehiculosPorRolChart();
        return this.appService.dashboardEntradas();
      }),
      catchError(err => {
        console.log(err);
        return this.appService.dashboardEntradas();
      }),
      switchMap(resp4 => {
        this.entradasDataset = resp4;
        return this.appService.dashboardSalidas();
      }),
      catchError(err => {
        console.log(err);
        return this.appService.dashboardSalidas();
      }),
      map(resp5 => {
        this.salidasDataset = resp5;
        this.loading = false;
      })
    );
  }

  setEspaciosOcupadosChart(): void {
    if (this.espaciosOcupadosChart) {
      this.espaciosOcupadosChart.destroy();
    }
    this.espaciosOcupadosChart = new Chart("espaciosOcupadosChart", {
      type: "doughnut",
      data: {
        labels: [
          'Espacios Ocupados',
          'Espacios Disponibles'
        ],
        datasets: [{
          label: 'Espacios Disponibles y Ocupados',
          data: this.espaciosOcupadosDataset,
          backgroundColor: [
            'rgb(146, 80, 14)',
            'rgb(239, 129, 19)',
            // 'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        color: "white"
      },
    });
  }

  setPersonasPorVehiculoChart(): void {
    if (this.personasPorVehiculoChart) {
      this.personasPorVehiculoChart.destroy();
    }
    this.personasPorVehiculoChart = new Chart("personasPorVehiculoChart", {
      type: "doughnut",
      data: {
        labels: [
          'Personal',
          'Mediano',
          'Grande'
        ],
        datasets: [{
          label: 'Personas por Vehiculo',
          data: this.personasPorVehiculoDataset,
          backgroundColor: [
            'rgb(17, 191, 242)',
            'rgb(136, 218, 38)',
            'rgb(177, 17, 242)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        color: "black"
      }
    });
  }

  setVehiculosPorRolChart(): void {
    if (this.vehiculosPorRolChart) {
      this.vehiculosPorRolChart.destroy();
    }
    this.vehiculosPorRolChart = new Chart("vehiculosPorRolChart", {
      type: "doughnut",
      data: {
        labels: [
          'Ajeno',
          'Estudiante',
          'Trabajador',
          'Catedratico'
        ],
        datasets: [{
          label: 'Vehiculo por Rol',
          data: this.vehiculosPorRolDataset,
          backgroundColor: [
            'rgb(216, 216, 216)',
            'rgb(248, 98, 78)',
            'rgb(54, 162, 235)',
            'rgb(248, 203, 78)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        color: "white"
      }
    });
  }
}
