import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CursosImagenService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly bucket =
    environment.supabase.cursosBucket || environment.supabase.publicidadBucket;

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

  urlPublica(path: string): string {
    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  private sanitizeFileName(name: string): string {
    const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
    return base || 'curso';
  }
}
