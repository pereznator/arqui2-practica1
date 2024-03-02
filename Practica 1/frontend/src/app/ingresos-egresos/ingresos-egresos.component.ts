import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { Observable, Subscription, interval, switchMap } from 'rxjs';
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
export class IngresosEgresosComponent implements OnInit, OnDestroy {
  chart: any;
  startDate: string;
  endDate: string;
  showAlert = false;
  timerSubscription: Subscription;

  constructor(
    private readonly appService: AppService
  ) {}

  ngOnInit(): void {
    this.buscar().subscribe();
    this.timerSubscription = interval(5000)
    .pipe(
      switchMap(() => this.buscar())
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  buscar(): Observable<any> {
    const params = {
      fecha_inicial: this.startDate ? moment.utc(this.startDate).subtract(1, "d").startOf("day").format("YYYY-MM-DD HH:mm:ss") : moment.utc().subtract(1, "d").startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      fecha_final: this.endDate ? moment.utc(this.endDate).subtract(1, "d").startOf("day").format("YYYY-MM-DD HH:mm:ss") : moment.utc().subtract(1, "d").endOf("day").format("YYYY-MM-DD HH:mm:ss")
    };
    return this.appService.historialDeIngresosYEgresos(params).pipe(
      switchMap(resp => {
        const registros = [];
        this.showAlert = false;
        resp.map(registro => {
          const label = moment.utc(registro.fecha).add(registro.hora, "hours").format("YYYY-MM-DD HH:mm:");
          const diferencia = Number(registro.diferencia);
          registros.push({ label, diferencia });
        });
        if (this.chart) {
          this.chart.destroy();
        }
        if (registros.length === 0) {
          this.showAlert = true;
        }
        this.chart = new Chart("chart", { 
          type: 'line', //this denotes tha type of chart
          data: {// values on X-Axis
            labels: registros.map(reg => reg.label),
            datasets: [
              {
                label: 'Dataset',
                data: registros.map(reg => reg.diferencia),
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
        return resp;
      })
    );
  }

  reset(): void {
    this.startDate = null;
    this.endDate = null;
    this.buscar();
  }
}
