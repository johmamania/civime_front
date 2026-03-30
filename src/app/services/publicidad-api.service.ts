import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PublicidadApiDto } from '../models/publicidad-api.model';

@Injectable({ providedIn: 'root' })
export class PublicidadApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.HOST}/public/publicidad`;

  /** Portada: solo activas (sin token). */
  getActivas(): Observable<PublicidadApiDto[]> {
    return this.http.get<PublicidadApiDto[]>(`${this.base}/activas`);
  }

  /** Admin: todas, orden por fecha (backend); filtro opcional. */
  getTodas(buscar?: string): Observable<PublicidadApiDto[]> {
    let params = new HttpParams();
    if (buscar?.trim()) {
      params = params.set('buscar', buscar.trim());
    }
    return this.http.get<PublicidadApiDto[]>(this.base, { params });
  }

  create(formData: FormData): Observable<PublicidadApiDto> {
    return this.http.post<PublicidadApiDto>(this.base, formData);
  }

  cambiarEstado(id: number, valor: 0 | 1): Observable<PublicidadApiDto> {
    const params = new HttpParams().set('valor', String(valor));
    return this.http.patch<PublicidadApiDto>(
      `${this.base}/${id}/estado`,
      {},
      { params }
    );
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }

  urlImagenAbsoluta(dto: Pick<PublicidadApiDto, 'urlArchivo'>): string {
    return `${environment.HOST}${dto.urlArchivo}`;
  }
}
