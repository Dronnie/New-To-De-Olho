import { Component, signal, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PoliticosService } from '../services/politicos.service';
import { FormsModule } from '@angular/forms';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Politico {
  id?: number;
  nome: string;
  cargo: 'vereador' | 'deputado' | 'senador';
  tipoDeputado?: 'federal' | 'estadual';
  estado: string;
  foto: string;
  remuneracao?: number;
  beneficios?: number;
  emendasParlamentares?: number;
  despesasCartao?: number;
}

interface DespesaCartao {
  id: number;
  mesExtrato: string;
  dataTransacao: string;
  valorTransacao: string;
}

interface Projeto {
  id: number;
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string;
  titulo?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  providers: [PoliticosService]
})
export class Dashboard implements OnInit, AfterViewInit {
  estadoSelecionado = signal<string>('');
  cargoSelecionado = signal<string>('');
  favoritos = signal<string[]>(this.carregarFavoritos());
  nomeBusca = signal<string>('');
  politicos = signal<Politico[]>([]);
  politicoSelecionado = signal<Politico | null>(null);
  dadosDetalhados = signal<any | null>(null);

  projetos = signal<Projeto[]>([]);

  filtroPeriodoValue: '30dias' | 'personalizado' = '30dias';
  dataInicio: string = '';
  dataFim: string = '';

  notificarDespesas = false;
  notificarCartao = false;
  notificarEmendas = false;

  notificacoesNaoLidas = signal<number>(3); // Pode ser dinâmico no futuro
  modalNotificacoesAberto = signal<boolean>(false);

  private chartDespesas: Chart | null = null;

  @ViewChild('graficoDespesasCanvas') graficoDespesasCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private politicosService: PoliticosService) {}

  ngOnInit(): void {
    this.carregarPoliticos();
    this.carregarProjetos();
  }

  ngAfterViewInit(): void {}

  abrirModalNotificacoes() {
    this.modalNotificacoesAberto.set(true);
    this.notificacoesNaoLidas.set(0); // Zera o contador
  }

  fecharModalNotificacoes() {
    this.modalNotificacoesAberto.set(false);
  }

  carregarPoliticos(): void {
    this.politicosService.listarDeputadosFederais().subscribe({
      next: (dadosDeputados: any[]) => {
        const deputadosAdaptados: Politico[] = dadosDeputados.map(d => ({
          id: d.id,
          nome: d.nome,
          cargo: 'deputado',
          tipoDeputado: d.tipoDeputado === 'federal' ? 'federal' : 'estadual',
          estado: d.siglaUf,
          foto: d.urlFoto
        }));

        this.politicosService.listarSenadores().subscribe({
          next: (res: any) => {
            const senadoresRaw = res.ListaParlamentarEmExercicio.Parlamentares.Parlamentar;
            const senadoresAdaptados: Politico[] = senadoresRaw.map((s: any) => ({
              id: s.IdentificacaoParlamentar.CodigoParlamentar,
              nome: s.IdentificacaoParlamentar.NomeParlamentar,
              cargo: 'senador',
              estado: s.IdentificacaoParlamentar.UfParlamentar,
              foto: s.IdentificacaoParlamentar.UrlFotoParlamentar
            }));

            this.politicos.set([...deputadosAdaptados, ...senadoresAdaptados]);
          },
          error: err => {
            console.error('Erro ao carregar senadores:', err);
            this.politicos.set(deputadosAdaptados); // fallback
          }
        });
      },
      error: err => {
        console.error('Erro ao carregar deputados:', err);
      }
    });
  }

  carregarProjetos(): void {
    this.politicosService.listarProjetos().subscribe({
      next: (dados: any[]) => {
        const adaptados: Projeto[] = dados.map(d => ({
          id: d.id,
          siglaTipo: d.siglaTipo,
          numero: d.numero,
          ano: d.ano,
          ementa: d.ementa,
          titulo: d.titulo || '',
        }));
        this.projetos.set(adaptados);
      },
      error: (err) => {
        console.error('Erro ao carregar projetos:', err);
      }
    });
  }

selecionarPolitico(p: Politico & { id?: number }): void {
  this.politicoSelecionado.set(p);

  if (p.id === undefined) {
    this.atualizarDadosDetalhadosMock();
    setTimeout(() => {
      this.inicializarGrafico();
      this.atualizarGrafico();
    }, 0);
    return;
  }

  if (p.cargo === 'deputado') {
    const mesInicio = '01/2025';
    const mesFim = '06/2025';

    // id como number para deputado
    this.politicosService.listarDespesasCartaoDeputado(p.id, mesInicio, mesFim).subscribe({
      next: (despesas: DespesaCartao[]) => {
        const totalDespesas = despesas.reduce(
          (acc, d) => acc + parseFloat(d.valorTransacao.replace(',', '.')),
          0
        );
        p.despesasCartao = totalDespesas;

        this.politicoSelecionado.set({ ...p });
        this.atualizarDadosDetalhadosMock();

        setTimeout(() => {
          this.inicializarGrafico();
          this.atualizarGrafico();
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar despesas do cartão:', err);
        this.atualizarDadosDetalhadosMock();
        setTimeout(() => {
          this.inicializarGrafico();
          this.atualizarGrafico();
        }, 0);
      }
    });
  } else if (p.cargo === 'senador') {
    // id como string para senador
    const idStr = String(p.id);
    this.politicosService.listarRemuneracaoSenador(idStr).subscribe({
      next: (remuneracao: any) => {
        this.dadosDetalhados.set({
          remuneracoesDTO: remuneracao.remuneracoes || [],
          despesasDistribuidas: remuneracao.despesas || { categorias: [], valores: [] },
          emendasParlamentares: remuneracao.emendas || 'R$ 0,00',
          beneficiosMensais: remuneracao.beneficios || 'R$ 0,00'
        });

        setTimeout(() => {
          this.inicializarGrafico();
          this.atualizarGrafico();
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar remuneração do senador:', err);
        this.atualizarDadosDetalhadosMock();
        setTimeout(() => {
          this.inicializarGrafico();
          this.atualizarGrafico();
        }, 0);
      }
    });
  } else {
    this.atualizarDadosDetalhadosMock();
    setTimeout(() => {
      this.inicializarGrafico();
      this.atualizarGrafico();
    }, 0);
  }
}








  atualizarDadosDetalhadosMock() {
    this.dadosDetalhados.set({
      remuneracoesDTO: [
        {
          mesAno: '07/2025',
          remuneracaoBasicaBruta: 'R$ 46.366,19',
          gratificacaoNatalina: 'R$ 2.813,00',
          outrasRemuneracoesEventuais: 'R$ 1.200,00',
          impostoRetidoNaFonte: 'R$ 6.000,00'
        }
      ],
      despesasDistribuidas: {
        categorias: ['Transporte', 'Alimentação', 'Comunicação', 'Outros'],
        valores: [5000, 3500, 1800, 1200]
      },
      emendasParlamentares: 'R$ 500.000,00',
      beneficiosMensais: 'R$ 4.500,00'
    });
  }

  aplicarFiltroPeriodo(): void {
    if (this.filtroPeriodoValue === '30dias') {
      const hoje = new Date();
      const inicio = new Date();
      inicio.setDate(hoje.getDate() - 30);

      this.dataInicio = inicio.toISOString().slice(0, 10);
      this.dataFim = hoje.toISOString().slice(0, 10);
    }

    this.atualizarDadosDetalhadosMock();
    this.atualizarGrafico();
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
        labels: [],
        datasets: [{
          label: 'Despesas (R$)',
          data: [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  atualizarGrafico() {
    if (!this.chartDespesas) return;

    const dados = this.dadosDetalhados();
    if (!dados || !dados.despesasDistribuidas) return;

    this.chartDespesas.data.labels = dados.despesasDistribuidas.categorias;
    this.chartDespesas.data.datasets[0].data = dados.despesasDistribuidas.valores;
    this.chartDespesas.update();
  }

  get estados(): string[] {
    return [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES',
      'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
      'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
      'SP', 'SE', 'TO'
    ];
  }

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  filtrar(p: Politico): boolean {
    const est = this.estadoSelecionado();
    const cargo = this.cargoSelecionado();
    const nome = this.nomeBusca().toLowerCase().trim();

    const filtraEstado = !est || p.estado === est;
    const filtraCargo = !cargo || p.cargo === cargo;
    const filtraNome = !nome || p.nome.toLowerCase().includes(nome);

    return filtraEstado && filtraCargo && filtraNome;
  }

  agruparPorEstadoCargo(): Record<string, Record<string, Politico[]>> {
    const grupos: Record<string, Record<string, Politico[]>> = {};
    for (const p of this.politicos().filter(this.filtrar.bind(this))) {
      if (!grupos[p.estado]) grupos[p.estado] = {};
      if (!grupos[p.estado][p.cargo]) grupos[p.estado][p.cargo] = [];
      grupos[p.estado][p.cargo].push(p);
    }
    return grupos;
  }

  toggleFavorito(nome: string): void {
    const favs = this.favoritos();
    const index = favs.indexOf(nome);
    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(nome);
    }
    this.favoritos.set([...favs]);
    localStorage.setItem('favoritos', JSON.stringify(favs));
  }

  isFavorito(nome: string): boolean {
    return this.favoritos().includes(nome);
  }

  carregarFavoritos(): string[] {
    try {
      const item = localStorage.getItem('favoritos');
      if (item) {
        return JSON.parse(item);
      }
      return [];
    } catch {
      return [];
    }
  }

  fecharDetalhes(): void {
    this.politicoSelecionado.set(null);
    this.dadosDetalhados.set(null);
  }
}
