import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-grafico-despesas',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas id="graficoDespesas"></canvas>`,
  styles: [`
    canvas {
      width: 100% !important;
      max-height: 300px;
    }
  `]
})
export class GraficoDespesas implements OnChanges {
  @Input() despesasData: { label: string; valor: number }[] = [];

  chart: Chart | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['despesasData']) {
      this.atualizarGrafico();
    }
  }

  atualizarGrafico() {
    const labels = this.despesasData.map(d => d.label);
    const valores = this.despesasData.map(d => d.valor);

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = (document.getElementById('graficoDespesas') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Despesas',
          data: valores,
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}
