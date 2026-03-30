import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../model/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, Subject, tap } from 'rxjs';
export interface ApiResponse<T> {  message: string;  data: T;}
@Injectable({
  providedIn: 'root'
})

export class MenuService extends GenericService<Menu>{

    private menuCache: Menu[] | null = null;
  private menuChange = new Subject<Menu[]>();

  constructor(http: HttpClient) {
    super(http, `${environment.HOST}/menus`);
  }

  getMenusByUser(username: string): Observable<ApiResponse<Menu[]>> {
    return this.http.post<ApiResponse<Menu[]>>(`${this.url}/user`, username).pipe(
      tap(resp => {
        this.menuCache = resp.data;           // guardar en caché
        this.setMenuChange(resp.data);        // notificar a los suscriptores
      })
    );
  }

    getCachedMenu(): Menu[] | null {
    return this.menuCache;
  }

  clearMenu(): void {
    this.menuCache = null;
    this.menuChange.next([]);
  }

  getMenuChange(){
    return this.menuChange.asObservable();
  }

  setMenuChange(menus: Menu[]){
    this.menuChange.next(menus);
  }

  //


  hasCachedMenu(): boolean {
    return this.menuCache !== null;
  }
}
