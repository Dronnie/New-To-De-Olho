import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PoliticoApiResponse {
  id: number;
  nome: string;
  siglaUf: string;
  urlFoto: string;
  tipo?: string;
  tipoDeputado?: string;
}

export interface DespesaCartao {
  id: number;
  mesExtrato: string;
  dataTransacao: string;
  valorTransacao: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoliticosService {
  private apiUrl = '/api/deputados';

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

listarSenadores() {
  return this.http.get<any>('/senado-api/dadosabertos/senador/lista/atual.json', {
    headers: { Accept: 'application/json' }
  });
}

listarRemuneracaoSenador(codigoParlamentar: string) {
  const url = `/senado-api/dadosabertos/senador/${codigoParlamentar}/remuneracao`;
  return this.http.get<any>(url);
}


listarDespesasSenador(codigoParlamentar: string) {
  const url = `https://legis.senado.leg.br/dadosabertos/senador/${codigoParlamentar}/gastos`;
  return this.http.get<any>(url);
}




  listarDespesasCartaoDeputado(deputadoId: number, mesInicio: string, mesFim: string): Observable<DespesaCartao[]> {
    const url = `/api/deputados/${deputadoId}/despesas-cartao?mesExtratoInicio=${mesInicio}&mesExtratoFim=${mesFim}`;
    return this.http.get<any>(url).pipe(
      map(response => response.dados as DespesaCartao[])
    );
  }

  buscarDetalhesDeputado(deputadoId: number): Observable<any> {
    const url = `/api/deputados/${deputadoId}/detalhes`;
    return this.http.get<any>(url).pipe(
      map(response => response.dados)
    );
  }

  // <-- Novo método para listar projetos reais da API da Câmara
  listarProjetos(): Observable<any[]> {
    const url = '/api/proposicoes?itens=10&ordenarPor=id&ordem=desc';
    return this.http.get<any>(url).pipe(
      map(response => response.dados || [])
    );
  }

  listarPautaEvento(eventoId: number) {
  const url = `/api/eventos/${eventoId}/pauta`;
  return this.http.get<any>(url).pipe(
    map(response => response.dados) // ajuste conforme estrutura da resposta
  );
}

}
