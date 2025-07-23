import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DespesaCartao {
  id: number;
  mesExtrato: string;
  dataTransacao: string;
  valorTransacao: string;
  tipoCartao: {
    id: number;
    codigo: string;
    descricao: string;
  };
  estabelecimento: {
    nome: string;
  };
  // outros campos que quiser incluir
}

@Injectable({
  providedIn: 'root'
})
export class DespesasCartaoService {
  private baseUrl = 'https://api.portaldatransparencia.gov.br/api-de-dados';

  constructor(private http: HttpClient) {}

  listarDespesasCartao(idDeputado: number, mesExtratoInicio: string, mesExtratoFim: string): Observable<DespesaCartao[]> {
    const url = `${this.baseUrl}/despesas-cartao-poder-legislativo`;
    const params = new HttpParams()
      .set('codigoOrgao', idDeputado.toString())
      .set('mesExtratoInicio', mesExtratoInicio)
      .set('mesExtratoFim', mesExtratoFim)
      .set('pagina', '1');
    return this.http.get<DespesaCartao[]>(url, { params });
  }
}
