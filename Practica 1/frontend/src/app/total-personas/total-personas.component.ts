import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import moment from 'moment';
import { Observable, Subscription, interval, switchMap } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-total-personas',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './total-personas.component.html',
  styleUrl: './total-personas.component.scss',
  providers: [AppService]
})
export class TotalPersonasComponent implements OnInit, OnDestroy {
  
  startDate: string;
  endDate: string;
  chart: Chart<"line">;
  timerSubscription: Subscription;
  showAlert = false;
  
  constructor(
    private appService: AppService
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
      fecha_inicial: this.startDate ? moment.utc(this.startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss") : moment.utc().subtract(1, "d").startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      fecha_final: this.endDate ? moment.utc(this.endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss") : moment.utc().subtract(1, "d").endOf("day").format("YYYY-MM-DD HH:mm:ss")
    };
    console.log("[PARAMS]", params);
    return this.appService.historialDePersonasPorDia(params).pipe(
      switchMap(resp => {
        console.log("RESP", resp);
        this.showAlert = false;
        if (this.chart) {
          this.chart.destroy();
        }
        if (resp.length === 0) {
          this.showAlert = true
        }
        this.chart = new Chart("chart", {
          type: "line",
          data: {
            labels: resp.map(registro => registro.fecha),
            datasets: [{
              label: 'Peronas que Ingresaron',
              data: resp.map(registro => registro.total),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            aspectRatio: 2.5
          }
        });
        return resp;
      })
    )
  }

  reset(): void {
    this.startDate = null;
    this.endDate = null;
    this.buscar();
  }
}
