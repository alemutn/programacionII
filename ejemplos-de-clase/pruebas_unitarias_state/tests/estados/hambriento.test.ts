import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { Contento, Hambriento } from "../../src/estados"
import Mascota from "../../src/mascota";

describe("Test Estado Hambriento", () => {

  let instance: Hambriento;
  let contento: DeepMockProxy<Contento> = mockDeep<Contento>();
  let mascota: DeepMockProxy<Mascota> = mockDeep<Mascota>();

  beforeEach(() => {
    instance = new Hambriento(mascota);
  })

  it("Verifica que la mascota cambie a estado Contento cuando come", ()=>{
    jest.spyOn(instance as any, "instanciarEstadoContento").mockReturnValueOnce(contento);
    instance.comer();
    expect(instance["instanciarEstadoContento"]).toHaveBeenCalled();
    expect(mascota.cambiarEstado).toHaveBeenCalledWith(contento);
  });

  it("Verifica que la mascota no puede jugar en el estado Hambriento", () => {
    expect(()=>instance.jugar()).toThrow("No puede jugar si está aburrida")
  })

})
