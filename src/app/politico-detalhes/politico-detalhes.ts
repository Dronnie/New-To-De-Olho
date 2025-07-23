import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-politico-detalhes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './politico-detalhes.html',
  styleUrls: ['./politico-detalhes.css']
})
export class PoliticoDetalhes implements AfterViewInit, OnChanges {
  @Input() dados: any;

  @ViewChild('graficoDespesas') graficoDespesasCanvas!: ElementRef<HTMLCanvasElement>;
  chartDespesas: Chart | null = null;

  ngAfterViewInit() {
    this.inicializarGrafico();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dados'] && this.chartDespesas) {
      this.atualizarGrafico();
    }
  }

  inicializarGrafico() {
    if (!this.graficoDespesasCanvas) return;
    const ctx = this.graficoDespesasCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chartDespesas) {
      this.chartDespesas.destroy();
    }

    this.chartDespesas = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dados?.despesasDistribuidas?.categorias || [],
        datasets: [{
          label: 'Despesas',
          data: this.dados?.despesasDistribuidas?.valores || [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  atualizarGrafico() {
    this.chartDespesas!.data.labels = this.dados?.despesasDistribuidas?.categorias || [];
    this.chartDespesas!.data.datasets[0].data = this.dados?.despesasDistribuidas?.valores || [];
    this.chartDespesas!.update();
  }
}
