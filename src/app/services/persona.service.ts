import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Nucleo } from '../model/nucleo';
import { Brigada } from '../model/brigada';
import { Dependencia } from '../model/dependencia';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private url: string = `${environment.HOST}/dependencia`;

  constructor(private http: HttpClient) { }

  findAllNucleos(){
    return this.http.get<Nucleo[]>(`${this.url}/nucleos`);
  }

  findAllBrigadasbyId(idNucleo: string){
    return this.http.get<Brigada[]>(`${this.url}/brigadas/${idNucleo}`);
  }

  findAllDependenciabyId(idBrigada: string){
    return this.http.get<Dependencia[]>(`${this.url}/unidad/${idBrigada}`);
  }
}
