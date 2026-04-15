import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, from, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CursoApiDto } from '../models/curso-api.model';
import { CursosImagenService } from './cursos-imagen.service';
import { SupabaseService } from './supabase.service';
import { AuthSupabaseService } from './auth-supabase.service';

interface CursoRow {
  id: number;
  titulo: string;
  descripcion: string;
  username: string | null;
  fecha_apertura: string | null;
  fecha_guardado: string | null;
  estado: number;
  name_img: string;
  url_archivo: string;
}

@Injectable({ providedIn: 'root' })
export class CursosApiService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly imagen = inject(CursosImagenService);
  private readonly auth = inject(AuthSupabaseService);

  getActivos(): Observable<CursoApiDto[]> {
    return from(
      this.supabase
        .from('cursos')
        .select('*')
        .eq('estado', 1)
        .order('fecha_guardado', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return (data ?? []).map((row) => this.mapRow(row as CursoRow));
      })
    );
  }

  getTodos(): Observable<CursoApiDto[]> {
    return from(
      this.supabase
        .from('cursos')
        .select('*')
        .order('fecha_guardado', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return (data ?? []).map((row) => this.mapRow(row as CursoRow));
      })
    );
  }

  getPorId(id: number): Observable<CursoApiDto> {
    return from(
      this.supabase
        .from('cursos')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapRow(data as CursoRow);
      })
    );
  }

  create(formData: FormData): Observable<CursoApiDto> {
    const titulo = String(formData.get('titulo') ?? '').trim();
    const descripcion = String(formData.get('descripcion') ?? '').trim();
    const estado = formData.get('estado') === '1' ? 1 : 0;
    const fechaApertura = String(formData.get('fechaApertura') ?? '').trim();
    const archivo = formData.get('archivo');
    const username = this.getUsernameActual();
    const fechaGuardado = new Date().toISOString();

    if (!titulo) {
      return throwError(() => new Error('Ingrese el título.'));
    }
    if (!descripcion) {
      return throwError(() => new Error('Ingrese la descripción.'));
    }
    if (!archivo || !(archivo instanceof File)) {
      return throwError(() => new Error('Seleccione una imagen.'));
    }

    return this.imagen.subir(archivo).pipe(
      switchMap(({ path, nameImg }) =>
        from(
          this.supabase
            .from('cursos')
            .insert({
              titulo,
              descripcion,
              username,
              fecha_apertura: fechaApertura || null,
              fecha_guardado: fechaGuardado,
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
        return this.mapRow(data as CursoRow);
      })
    );
  }

  actualizar(id: number, formData: FormData): Observable<CursoApiDto> {
    const titulo = String(formData.get('titulo') ?? '').trim();
    const descripcion = String(formData.get('descripcion') ?? '').trim();
    const estado = formData.get('estado') === '1' ? 1 : 0;
    const fechaApertura = String(formData.get('fechaApertura') ?? '').trim();
    const archivo = formData.get('archivo');
    const username = this.getUsernameActual();
    const fechaGuardado = new Date().toISOString();

    if (!titulo) {
      return throwError(() => new Error('Ingrese el título.'));
    }
    if (!descripcion) {
      return throwError(() => new Error('Ingrese la descripción.'));
    }

    return from(
      this.supabase
        .from('cursos')
        .select('url_archivo')
        .eq('id', id)
        .single()
    ).pipe(
      switchMap(({ data: actual, error: errActual }) => {
        if (errActual) {
          throw errActual;
        }
        const oldPath = (actual as { url_archivo?: string } | null)?.url_archivo;
        if (!archivo || !(archivo instanceof File)) {
          return from(
            this.supabase
              .from('cursos')
              .update({
                titulo,
                descripcion,
                username,
                fecha_apertura: fechaApertura || null,
                fecha_guardado: fechaGuardado,
                estado
              })
              .eq('id', id)
              .select()
              .single()
          );
        }

        return this.imagen.subir(archivo).pipe(
          switchMap(({ path, nameImg }) =>
            from(
              this.supabase
                .from('cursos')
                .update({
                  titulo,
                  descripcion,
                  username,
                  fecha_apertura: fechaApertura || null,
                  fecha_guardado: fechaGuardado,
                  estado,
                  name_img: nameImg,
                  url_archivo: path
                })
                .eq('id', id)
                .select()
                .single()
            ).pipe(
              switchMap(async (resp) => {
                if (oldPath) {
                  try {
                    await firstValueFrom(this.imagen.eliminar(oldPath));
                  } catch (e) {
                    console.warn('No se pudo borrar imagen anterior de curso:', e);
                  }
                }
                return resp;
              })
            )
          )
        );
      }),
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapRow(data as CursoRow);
      })
    );
  }

  cambiarEstado(id: number, valor: 0 | 1): Observable<CursoApiDto> {
    return from(
      this.supabase
        .from('cursos')
        .update({
          estado: valor,
          username: this.getUsernameActual(),
          fecha_guardado: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapRow(data as CursoRow);
      })
    );
  }

  eliminar(id: number): Observable<unknown> {
    return from(
      (async () => {
        const { data: row, error: errSelect } = await this.supabase
          .from('cursos')
          .select('url_archivo')
          .eq('id', id)
          .maybeSingle();
        if (errSelect) {
          throw errSelect;
        }
        const path = row?.url_archivo as string | undefined;

        const { error: errDelete } = await this.supabase
          .from('cursos')
          .delete()
          .eq('id', id);
        if (errDelete) {
          throw errDelete;
        }

        if (path) {
          try {
            await firstValueFrom(this.imagen.eliminar(path));
          } catch (e) {
            console.warn('No se pudo borrar la imagen del curso:', e);
          }
        }
      })()
    );
  }

  urlImagenAbsoluta(dto: Pick<CursoApiDto, 'urlArchivo'>): string {
    return this.imagen.urlPublica(dto.urlArchivo);
  }

  private mapRow(row: CursoRow): CursoApiDto {
    return {
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      username: row.username,
      fechaApertura: row.fecha_apertura,
      fechaGuardado: row.fecha_guardado,
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
