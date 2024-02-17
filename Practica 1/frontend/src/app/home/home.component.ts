import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AppService } from '../app.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [AppService]
})
export class HomeComponent implements OnInit {
  
  loading: boolean = true;
  espaciosOcupadosChart: any;
  personasPorVehiculoChart: any;
  vehiculosPorRolChart: any;

  espaciosOcupadosDataset: number[];
  personasPorVehiculoDataset: number[];
  vehiculosPorRolDataset: number[];
  entradasDataset: any[];
  salidasDataset: any[];

  constructor(private appService: AppService) {
    
  }
  
  ngOnInit(): void {
    this.getEspaciosOcupadosData();
    // this.setCharts();
  }

  getEspaciosOcupadosData(): void {
    this.loading = true;
    this.appService.dashboarEspaciosOcupados().subscribe(resp => {
      console.log(resp);
      this.espaciosOcupadosDataset = [resp[0].Ocupados, resp[0].Libres];
      this.getPersonasPorVehiculoDataset();
    }, err => {
      console.log(err);
    });
  }

  getPersonasPorVehiculoDataset(): void {
    this.appService.dashboardPersonasPorVehiculo().subscribe(resp => {
      console.log(resp);
      this.personasPorVehiculoDataset = [resp[0].Personal, resp[0].Mediano, resp[0].Grande];
      this.getVehiculosPorRolDataset();
    }, err => {
      console.log(err);
    });
  }
  
  getVehiculosPorRolDataset(): void {
    this.appService.dashboardVehiculosPorRol().subscribe(resp => {
      console.log(resp);
      this.vehiculosPorRolDataset = [resp[0].Ajenos, resp[0].Estudiantes, resp[0].Trabajador, resp[0].Catedratico];
      this.getEntradasDataset();
    }, err => {
      console.log(err);
    });
  }
  
  getEntradasDataset(): void {
    this.appService.dashboardEntradas().subscribe(resp => {
      console.log(resp);
      this.entradasDataset = resp;
      this.getSalidasDataset();
    }, err => {
      console.log(err);
    });
  }
  
  getSalidasDataset(): void {
    this.appService.dashboardSalidas().subscribe(resp => {
      console.log(resp);
      this.salidasDataset = resp;
      this.setCharts();
    }, err => {
      console.log(err);
    });  
  }

  setCharts(): void {
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
    this.loading = false;
  }
}
