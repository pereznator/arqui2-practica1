import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import moment from 'moment';

@Component({
  selector: 'app-ingresos-egresos',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './ingresos-egresos.component.html',
  styleUrl: './ingresos-egresos.component.scss',
  providers: [AppService]
})
export class IngresosEgresosComponent implements OnInit {
  chart: any;
  startDate: string;
  endDate: string;

  timerSubscription: Subscription;

  constructor(
    private readonly appService: AppService
  ) {}

  ngOnInit(): void {
    this.buscar();
    this.chart = new Chart("chart", { 
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
        datasets: [
          {
            label: 'Dataset',
            data: [-100, -80, -60, -40, -20, 0],
            borderColor: "rgba(231, 76, 60, 1)",
            backgroundColor: "rgba(231, 76, 60, 0.5)",
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            // text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
          }
        }
      }
    });
  }

  buscar(): void {
    const params = {
      fecha_inicial: this.startDate ?? moment.utc().subtract(1, "d").startOf("day").toISOString(),
      fecha_final: this.endDate ?? moment.utc().subtract(1, "d").endOf("day").toISOString()
    };
    console.log(params);
    this.appService.historialDeIngresosYEgresos(params).subscribe(resp => {
      console.log(resp);
    }, err => {
      console.log(err);
    })
  }

  reset(): void {
    
  }
}
