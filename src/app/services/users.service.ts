import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../model/users';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Persona } from '../model/persona';
import { UserSave } from '../model/usesave';
import { UserUpdate } from '../model/userupdate';
import { PersonaSave } from '../model/personaSave';
import { Rol } from '../model/rol';
import { Inspectoria } from '../model/inspectoria';



export interface ApiResponse<T> {  message: string;  data: T;}
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url: string = `${environment.HOST}/users`;

  private userChange: Subject<User[]> = new Subject<User[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  private usuarioLogeadoSubject = new BehaviorSubject<User | null>(null);
  public usuarioLogeado$ = this.usuarioLogeadoSubject.asObservable();

  setUsuarioLogeado(usuario: User): void {
   this.usuarioLogeadoSubject.next(usuario);
  }

  getUsuarioLogeado(): User | null {
    return this.usuarioLogeadoSubject.value;
  }


 filterusers(s: string, page: number, pageSize: number): Observable<ApiResponse<any>>{
      let params = new HttpParams()
        .set('s', s)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
      return this.http.get<ApiResponse<any>>(`${this.url}/pageable`, { params: params });
    }

  crearUsuarioConRoles(user: UserSave): Observable<any> {
    return this.http.post(`${this.url}?idsRoles=1,2,3`, user);
  }

  saveUser(user: UserSave): Observable<any> {
    return this.http.post<any>(`${this.url}/save`, user);

  }
  updateUser(userId: number, user: UserSave): Observable<any> {
    return this.http.put<any>(`${this.url}/${userId}`, user);
  }

  changeRoles(username: string, rolesIds: number[]): Observable<any> {
    const url = `${this.url}/roles/${username}`;
    return this.http.put(url, rolesIds);
  }

  changeEstado(username: string, estado: number): Observable<any> {
    return this.http.put(`${this.url}/estado/${username}/${estado}`, {});
  }

  getByIdUser(idUser: number) {
    return this.http.get<User>(`${this.url}/username/${idUser}`);
  }

  getByUsername(username: string):Observable <ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.url}/${username}`);
  }

  getByDni(dni: string) {
    return this.http.get<User>(`${this.url}/dni/${dni}`);
  }

  listPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  setUserChange(data: User[]) {
    this.userChange.next(data);
  }

  getUserChange() {
    return this.userChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  //roles
  getRolesAll(): Observable<ApiResponse<Rol[]>> {
    return this.http.get<ApiResponse<Rol[]>>(`${this.url}/roles-all`);
  }

  getRolesForUser(id: string): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}/roles/${id}`);
  }


 getListMisRoles(username:string):Observable<ApiResponse<any[]>>{
      return this.http.get<ApiResponse<any[]>>(`${this.url}/roles-user/${username}`, { });
    }

  changeRoleActive(username: string, idRole: number): Observable<any> {
    return this.http.put<ApiResponse<any[]>>(`${this.url}/change-role-active/${username}/${idRole}`, { });
  }









  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  findAll() {
    return this.http.get<User[]>(this.url);
  }

  // Inspectorias
  listInspectoriasByNivel(nivel: number): Observable<ApiResponse<Inspectoria[]>> {
    return this.http.get<ApiResponse<Inspectoria[]>>(`${this.url}/igs-nivel/${nivel}`);
  }


  listInspectoriasByIdPadre(idPadre: number): Observable<ApiResponse<Inspectoria[]>> {
    return this.http.get<ApiResponse<Inspectoria[]>>(`${this.url}/igs-id-pabre/${idPadre}`);
  }


}
