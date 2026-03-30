import { Brigada } from "./brigada";
import { Dependencia } from "./dependencia";
import { Nucleo } from "./nucleo";

export class UserSave {

    username: string;
    cip: string;
    grado: string;
    arma: string;
    fullname?: string;
    estado: number;
    telefono?: String;

    nucleo:any;
    brigada:any;
    unidad:any;
    roles:any[];

}
