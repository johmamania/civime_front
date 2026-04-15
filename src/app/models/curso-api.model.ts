export interface CursoApiDto {
  id: number;
  titulo: string;
  descripcion: string;
  username?: string | null;
  fechaApertura?: string | null;
  fechaGuardado?: string | null;
  estado: number;
  nameImg: string;
  urlArchivo: string;
}
