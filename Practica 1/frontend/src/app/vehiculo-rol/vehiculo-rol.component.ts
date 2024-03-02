import { NgIf } from '@angular/common';
import {Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from "chart.js/auto";
import { Observable, Subscription, interval, switchMap } from 'rxjs';
import { AppService } from '../app.service';
import moment from 'moment';

@Component({
  selector: 'app-vehiculo-rol',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './vehiculo-rol.component.html',
  styleUrl: './vehiculo-rol.component.scss',
  providers: [AppService]
})
export class VehiculoRolComponent implements OnInit, OnDestroy {
  // loading: boolean = true;
  public chart: Chart<"bar">;
  startDate: string;
  endDate: string;
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
      fecha_inicial: this.startDate ? moment.utc(this.startDate).subtract(1, "d").startOf("day").format("YYYY-MM-DD HH:mm:ss") : moment.utc().subtract(1, "d").startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      fecha_final: this.endDate ? moment.utc(this.endDate).subtract(1, "d").endOf("day").format("YYYY-MM-DD HH:mm:ss") : moment.utc().subtract(1, "d").endOf("day").format("YYYY-MM-DD HH:mm:ss")
    };
    return this.appService.historialDeVehiculosPorRol(params).pipe(
      switchMap(resp => {
        console.log("RESP", resp);
        this.showAlert = false;
        if (this.chart) {
          this.chart.destroy();
        }

        if (resp.length === 0) {
          this.showAlert = true;
        }

        this.chart = new Chart("chart", { 
          type: 'bar', //this denotes tha type of chart
          data: {// values on X-Axis
            labels: resp.map(registro => registro.fecha), 
             datasets: [
              {
                label: "Trabajador",
                data: resp.map(registro => registro.data.trabajador),
                backgroundColor: 'blue'
              },
              {
                label: "Catedratico",
                data: resp.map(registro => registro.data['catedrático']),
                backgroundColor: 'yellow'
              }, 
              {
                label: "Estudiante",
                data: resp.map(registro => registro.data.estudiante),
                backgroundColor: 'red'
              }, 
              {
                label: "Otro",
                data: resp.map(registro => registro.data.ajeno),
                backgroundColor: 'gray'
              }, 
            ]
          },
          options: {
            aspectRatio: 2.5
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
