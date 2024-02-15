import { NgIf } from '@angular/common';
import {Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from "chart.js/auto";

@Component({
  selector: 'app-vehiculo-rol',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './vehiculo-rol.component.html',
  styleUrl: './vehiculo-rol.component.scss'
})
export class VehiculoRolComponent implements OnInit {
  // loading: boolean = true;
  public chart: any;
  startDate: string;
  endDate: string;

  constructor() {
  }
  
  ngOnInit(): void {
    this.chart = new Chart("chart", { 
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13', '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17'], 
         datasets: [
          {
            label: "Sales",
            data: [467,576, 572, 79, 92, 574, 573, 576],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: [542, 542, 536, 327, 17, 0, 538, 541],
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  buscar(): void {

  }

  reset(): void {
    
  }
}
