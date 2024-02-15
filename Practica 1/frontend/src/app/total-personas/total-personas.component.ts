import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-total-personas',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './total-personas.component.html',
  styleUrl: './total-personas.component.scss'
})
export class TotalPersonasComponent implements OnInit {
  
  startDate: string;
  endDate: string;
  chart: any;
  
  constructor() {}
  
  ngOnInit(): void {
    this.chart = new Chart("chart", {
      type: "line",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
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
