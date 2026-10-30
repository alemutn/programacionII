import Mascota from "../mascota";
import {
  Contento, 
  Estado 
} from ".";

export default class Hambriento implements Estado {

  public constructor(private mascota: Mascota) { }

  public setMascota(mascota: Mascota): void {
    this.mascota = mascota;
  }

  public comer(): void {
    const nuevo = this.instanciarEstadoContento();
    this.mascota.cambiarEstado(nuevo);
  }

  public jugar(): void {
    throw new Error("No puede jugar si está aburrida");
  }

  private instanciarEstadoContento(): Contento {
    return new Contento(this.mascota);
  }

}


