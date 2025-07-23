import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PoliticoApiResponse {
  id: number;
  nome: string;
  siglaUf: string;
  urlFoto: string;
  tipo: string; // deputado, senador...
  tipoDeputado?: string; // federal, estadual
}

@Injectable({
  providedIn: 'root'
})
export class PoliticosService {
  private apiUrl = 'https://dadosabertos.camara.leg.br/api/v2/deputados'; // Exemplo para deputados federais

  constructor(private http: HttpClient) {}

  listarDeputadosFederais(): Observable<PoliticoApiResponse[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.dados.map((item: any) => ({
        id: item.id,
        nome: item.nome,
        siglaUf: item.siglaUf,
        urlFoto: item.urlFoto,
        tipo: 'deputado',
        tipoDeputado: 'federal'
      })))
    );
  }

  // Você pode criar métodos similares para senadores e vereadores (se a API disponibilizar)
}
