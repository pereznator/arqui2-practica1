import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  
  espaciosOcupadosChart: any;
  personasPorVehiculoChart: any;
  vehiculosPorRolChart: any;

  constructor() {
    
  }
  
  ngOnInit(): void {
    this.setCharts();
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
          label: 'My First Dataset',
          data: [174, 26],
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
      }
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
          label: 'My First Dataset',
          data: [300, 50, 100],
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
          label: 'My First Dataset',
          data: [40, 300, 50, 100],
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
