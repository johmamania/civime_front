import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PublicidadApiDto } from '../models/publicidad-api.model';
import { PublicidadImagenService } from './publicidad-imagen.service';
import { SupabaseService } from './supabase.service';
import { AuthSupabaseService } from './auth-supabase.service';

interface PublicidadRow {
  id: number;
  titulo: string | null;
  descripcion: string;
  username: string | null;
  fecha: string;
  estado: number;
  name_img: string;
  url_archivo: string;
}

@Injectable({ providedIn: 'root' })
export class PublicidadApiService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly imagen = inject(PublicidadImagenService);
  private readonly auth = inject(AuthSupabaseService);

  /** Portada: solo activas (sin token). */
  getActivas(): Observable<PublicidadApiDto[]> {
    return from(
      this.supabase
        .from('publicidad')
        .select('*')
        .eq('estado', 1)
        .order('fecha', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return (data ?? []).map((row) => this.mapRow(row as PublicidadRow));
      })
    );
  }

  /** Admin: todas, orden por fecha; el filtro por texto sigue siendo en el componente. */
  getTodas(_buscar?: string): Observable<PublicidadApiDto[]> {
    return from(
      this.supabase
        .from('publicidad')
        .select('*')
        .order('fecha', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return (data ?? []).map((row) => this.mapRow(row as PublicidadRow));
      })
    );
  }

  create(formData: FormData): Observable<PublicidadApiDto> {
    const titulo = String(formData.get('titulo') ?? '').trim();
    const descripcion = String(formData.get('descripcion') ?? '').trim();
    const estado = formData.get('estado') === '1' ? 1 : 0;
    const archivo = formData.get('archivo');
    const username = this.getUsernameActual();

    if (!archivo || !(archivo instanceof File)) {
      return throwError(() => new Error('Archivo requerido.'));
    }

    return this.imagen.subir(archivo).pipe(
      switchMap(({ path, nameImg }) =>
        from(
          this.supabase
            .from('publicidad')
            .insert({
              titulo: titulo || null,
              descripcion,
              username,
              estado,
              name_img: nameImg,
              url_archivo: path
            })
            .select()
            .single()
        )
      ),
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapRow(data as PublicidadRow);
      })
    );
  }

  cambiarEstado(id: number, valor: 0 | 1): Observable<PublicidadApiDto> {
    return from(
      this.supabase
        .from('publicidad')
        .update({ estado: valor })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapRow(data as PublicidadRow);
      })
    );
  }

  actualizarTexto(
    id: number,
    payload: Pick<PublicidadApiDto, 'titulo' | 'descripcion'>
  ): Observable<PublicidadApiDto> {
    const username = this.getUsernameActual();
    return from(
      this.supabase
        .from('publicidad')
        .update({
          titulo: payload.titulo?.trim() || null,
          descripcion: payload.descripcion.trim(),
          username
        })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapRow(data as PublicidadRow);
      })
    );
  }

  eliminar(id: number): Observable<unknown> {
    return from(
      (async () => {
        const { data: row, error: errSelect } = await this.supabase
          .from('publicidad')
          .select('url_archivo')
          .eq('id', id)
          .maybeSingle();
        if (errSelect) {
          throw errSelect;
        }
        const path = row?.url_archivo as string | undefined;

        const { error: errDel } = await this.supabase
          .from('publicidad')
          .delete()
          .eq('id', id);
        if (errDel) {
          throw errDel;
        }

        if (path) {
          try {
            await firstValueFrom(this.imagen.eliminar(path));
          } catch (e) {
            console.warn('No se pudo borrar el archivo en Storage:', e);
          }
        }
      })()
    );
  }

  urlImagenAbsoluta(dto: Pick<PublicidadApiDto, 'urlArchivo'>): string {
    return this.imagen.urlPublica(dto.urlArchivo);
  }

  private mapRow(row: PublicidadRow): PublicidadApiDto {
    return {
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      username: row.username,
      fecha: row.fecha,
      estado: row.estado,
      nameImg: row.name_img,
      urlArchivo: row.url_archivo
    };
  }

  private getUsernameActual(): string {
    const token = this.auth.getToken();
    if (!token) {
      return 'usuario';
    }
    return this.auth.getUsernameFromToken(token);
  }
}
