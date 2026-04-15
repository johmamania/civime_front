export interface PublicidadApiDto {
  id: number;
  titulo?: string | null;
  descripcion: string;
  username?: string | null;
  fecha: string;
  estado: number;
  nameImg: string;
  urlArchivo: string;
}
