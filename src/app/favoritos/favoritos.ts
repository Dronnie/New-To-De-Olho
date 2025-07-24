import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PoliticosService } from '../services/politicos.service';

interface Politico {
  id?: number;
  nome: string;
  cargo: 'vereador' | 'deputado' | 'senador';
  tipoDeputado?: 'federal' | 'estadual';
  estado: string;
  foto: string;
}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './favoritos.html',
  styleUrls: ['./favoritos.css'],
  providers: [PoliticosService]
})
export class Favoritos implements OnInit {
  favoritos: string[] = [];
  politicosFavoritos: Politico[] = [];

  constructor(private politicosService: PoliticosService) {}


removerFavorito(nome: string): void {
  this.favoritos = this.favoritos.filter(n => n !== nome);
  localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
  this.politicosFavoritos = this.politicosFavoritos.filter(p => p.nome !== nome);
}

  ngOnInit(): void {
    this.carregarFavoritos();

    // Carrega todos os políticos e filtra os favoritos
    this.politicosService.listarDeputadosFederais().subscribe({
      next: (deputados) => {
        this.politicosService.listarSenadores().subscribe({
          next: (res: any) => {
            const senadoresRaw = res.ListaParlamentarEmExercicio.Parlamentares.Parlamentar;
            const senadores = senadoresRaw.map((s: any) => ({
              id: s.IdentificacaoParlamentar.CodigoParlamentar,
              nome: s.IdentificacaoParlamentar.NomeParlamentar,
              cargo: 'senador',
              estado: s.IdentificacaoParlamentar.UfParlamentar,
              foto: s.IdentificacaoParlamentar.UrlFotoParlamentar
            }));

            const todos = [...deputados, ...senadores];
            this.politicosFavoritos = todos.filter(p => this.favoritos.includes(p.nome));
          },
          error: err => console.error('Erro ao buscar senadores:', err)
        });
      },
      error: err => console.error('Erro ao buscar deputados:', err)
    });
  }

  carregarFavoritos(): void {
    try {
      const item = localStorage.getItem('favoritos');
      this.favoritos = item ? JSON.parse(item) : [];
    } catch {
      this.favoritos = [];
    }
  }
}
