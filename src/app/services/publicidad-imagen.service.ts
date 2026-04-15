import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { SupabaseService } from './supabase.service';

/** Subida, borrado y URL pública de imágenes de publicidad en Storage. */
@Injectable({ providedIn: 'root' })
export class PublicidadImagenService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly bucket = environment.supabase.publicidadBucket;

  /**
   * Sube el archivo al bucket y devuelve la ruta del objeto y el nombre mostrable.
   */
  subir(archivo: File): Observable<{ path: string; nameImg: string }> {
    const safeName = this.sanitizeFileName(archivo.name);
    const path = `${crypto.randomUUID()}-${safeName}`;

    return from(
      this.supabase.storage.from(this.bucket).upload(path, archivo, {
        cacheControl: '3600',
        upsert: false
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        if (!data?.path) {
          throw new Error('Storage no devolvió ruta.');
        }
        return { path: data.path, nameImg: safeName };
      })
    );
  }

  /** Elimina el objeto en Storage (ruta relativa al bucket). */
  eliminar(path: string): Observable<void> {
    if (!path?.trim()) {
      return throwError(() => new Error('Ruta vacía.'));
    }
    return from(
      this.supabase.storage.from(this.bucket).remove([path])
    ).pipe(
      map(({ error }) => {
        if (error) {
          throw error;
        }
      })
    );
  }

  /** URL pública para usar en <img src="..."> (bucket debe ser público o con política de lectura). */
  urlPublica(path: string): string {
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  private sanitizeFileName(name: string): string {
    const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
    return base || 'imagen';
  }
}
