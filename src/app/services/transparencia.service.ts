import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransparenciaService {
  private baseUrl = 'https://api.portaldatransparencia.gov.br/api-de-dados';

  constructor(private http: HttpClient) {}

  listarOrgaosSiafi(pagina: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/orgaos-siafi?pagina=${pagina}`);
  }

  // Adicione outros métodos para endpoints que precisar
}
