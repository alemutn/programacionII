import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import {
  Aburrido,
  Contento,
  Estado,
  Hambriento,
} from "../src/estados";
import Mascota from "../src/mascota";

describe("Test Mascota", () => {

  let instance: Mascota;
  let contenta: DeepMockProxy<Contento> = mockDeep<Contento>();
  let hambrienta: DeepMockProxy<Hambriento> = mockDeep<Hambriento>();
  let aburrida: DeepMockProxy<Aburrido> = mockDeep<Aburrido>();

  beforeEach(() => {
    instance = new Mascota(hambrienta);    
  })

  afterEach(() => {})

  describe("Mascota Hambriento", () => {
    it("Debe delegar la responsabilidad de comer al estado establecido", () => {
      instance.comer();
      expect(hambrienta.comer).toHaveBeenCalled()
    });

    it("No puede jugar", () => {
      try {
        instance.jugar()
        expect(hambrienta.jugar).toHaveBeenCalled()
      }
      catch (error) {
        expect(error.message).toEqual("No puede jugar si está aburrida")
      }
    });

  });
  

})
