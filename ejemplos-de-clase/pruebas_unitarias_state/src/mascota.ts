import Estado  from "./estados/estado";

const FELICIDAD_DEFAULT = 1;

export default class Mascota {
  
  private felicidad: number;

  public constructor(private estado: Estado) {
    this.felicidad = 0;
  }

  public cambiarEstado(nuevo: Estado): void {
    this.estado = nuevo;
  }

  public getFelicidad(): number {
    return this.felicidad;
  }

  public incrementarFelicidad(valor: number = FELICIDAD_DEFAULT): void {
    this.felicidad += valor;
  }

  public comer(): void {
    this.estado.comer();
  }

  public jugar(): void {
    this.estado.jugar();
  }
}
