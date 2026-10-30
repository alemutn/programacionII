import Mascota from "../mascota";
import {
  Contento,
  Estado
}  from ".";

const SEGUNDOS = 60;
const MILISEGUNDOS = 1000;
const MAX_MINS_EN_ESTADO = 80;

export default class Aburrido implements Estado {

  private tiempoInicio: number;

  public constructor(private mascota: Mascota) { 
    this.tiempoInicio = Date.now();
  }

  public comer(): void {
    if (this.enEstadoHaceMasDe(MAX_MINS_EN_ESTADO)) {
      this.cambiarANuevoEstado();
    }
  }

  public jugar(): void {
    this.cambiarANuevoEstado();
  }

  /**
   * Cambia la mascota al nuevo estado.
   * Metodo auxiliar para no repetir código en comer() y jugar8)
   */
  private cambiarANuevoEstado():void {
      const nuevo = new Contento(this.mascota);
      this.mascota.cambiarEstado(nuevo);
  }

  /**
   * Verifica si la mascota pasó más tiempo del indicado en el estado.
   * 
   * @param {number} tiempo tiempo limite en minutos que la mascota se encuentra en el estado.
   * @returns {boolean}
   */
  private enEstadoHaceMasDe(tiempo: number): boolean {
    const tiempoFin = Date.now();
    return (tiempoFin - this.tiempoInicio) > tiempo*SEGUNDOS*MILISEGUNDOS;
  }

}
