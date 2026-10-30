import Mascota from "../mascota";
import Estado from "./estado";

const FELICIDAD_JUGAR = 2;

export default class Contento implements Estado {

  public constructor(private mascota: Mascota) { }

  public comer(): void {
    this.mascota.incrementarFelicidad();
  }

  public jugar(): void {
    this.mascota.incrementarFelicidad(FELICIDAD_JUGAR);
  }

}

