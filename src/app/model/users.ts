import { AnyObject } from "chart.js/dist/types/basic";
import { Brigada } from "./brigada";
import { Dependencia } from "./dependencia";
import { Nucleo } from "./nucleo";
import { Rol } from "./rol";

export class User {
    idUser: number;
    username: string;
    cip: string;
    dni: string;
    grado: string;
    arma: string;
    fullname: string;
    estado:string;
    inspectoria?: any;
    cargo?: any;
    roleActive?:Rol;
    nucleo: Nucleo;
    brigada: Brigada;
    unidad: Dependencia;
    roles: Rol[];
}
