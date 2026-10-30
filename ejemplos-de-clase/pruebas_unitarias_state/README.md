# Pruebas unitarias con el patrón State – Mascota virtual

## Objetivo

Este proyecto es un ejemplo de clase que resuelve el ejercicio [Mascota virtual](../Ejercicio_Mascota_virtual.md) con el patrón **State**. Muestra cómo escribir **pruebas unitarias** con Jest y `jest-mock-extended` sobre un diseño en el que el comportamiento de un objeto depende de su estado interno.

El enunciado pide modelar una mascota (al estilo Tamagotchi) que puede estar **hambrienta**, **contenta** o **aburrida**, y que responde de forma distinta a los mensajes `comer()` y `jugar()` según el estado en el que esté. Además, el enunciado **prohíbe consultar el estado actual de la mascota** (nada de `estado === "contento"`). Esto define cómo se prueba: no se puede preguntar "¿en qué estado está?". Lo que se verifica es **qué mensajes se envían** entre los objetos.

## Resumen de la implementación

* `Mascota` (`src/mascota.ts`) es el **contexto**. Guarda la felicidad (un entero que arranca en 0) y una referencia privada a su `Estado`. Los métodos `comer()` y `jugar()` no tienen lógica propia: **delegan** en el estado actual. Expone `cambiarEstado(nuevo)` para que los estados puedan reemplazarse a sí mismos, e `incrementarFelicidad(valor)` para que los estados modifiquen el nivel.
* `Estado` (`src/estados/estado.ts`) es la interfaz común, con `comer()` y `jugar()`.
* `Hambriento` (`src/estados/hambriento.ts`): al comer, crea un `Contento` mediante el método privado `instanciarEstadoContento()` y se lo pasa a `mascota.cambiarEstado(...)`. Al jugar, lanza un error.
* `Contento` (`src/estados/contento.ts`): al comer, incrementa la felicidad en 1. Al jugar, la incrementa en 2.
* `Aburrido` (`src/estados/aburrido.ts`): guarda el momento en que se creó (`Date.now()`). Al jugar, pasa a `Contento`. Al comer, pasa a `Contento` solo si estuvo aburrido más de 80 minutos.

La regla del enunciado se cumple porque **la transición la decide cada estado** y no la mascota. `Mascota` nunca pregunta en qué estado está.

## Pruebas unitarias realizadas

La idea central es **probar cada clase de forma aislada**. La clase bajo prueba es siempre un objeto **real**, y sus colaboradores se reemplazan por **mocks** (`mockDeep` de `jest-mock-extended`). Así cada test verifica una sola responsabilidad:

| Clase bajo prueba | Objeto real | Se mockea | Qué se verifica |
|---|---|---|---|
| `Mascota` | `Mascota` | el `Estado` | que delega `comer()` y `jugar()` en su estado |
| `Hambriento` | `Hambriento` | la `Mascota` y el `Contento` | que le pide a la mascota cambiar al estado correcto |

### `tests/mascota.test.ts` – el contexto delega en el estado

La `Mascota` se construye en el `beforeEach` con un `Hambriento` **mockeado**. Como el estado es un mock, sus métodos no ejecutan ninguna lógica real. Solo registran que fueron llamados.

* **"Debe delegar la responsabilidad de comer al estado establecido"**: llama a `instance.comer()` y verifica con `expect(hambrienta.comer).toHaveBeenCalled()` que la mascota le pasó el mensaje a su estado. Este test **no** comprueba el cambio a `Contento`, porque eso es responsabilidad del estado y se prueba en su propio archivo.
* **"No puede jugar"**: llama a `instance.jugar()` y verifica que el mensaje llegó a `hambrienta.jugar`. Como el estado es un mock, no lanza el error real, así que la aserción que se ejecuta es la del bloque `try`. El `catch` funciona como red de seguridad si el estado lanzara la excepción.

> **Error común:** si en este archivo se intenta verificar que la mascota "pasó a Contento", el test falla. El `Hambriento` es un mock, así que su `comer()` está vacío y nunca llama a `mascota.cambiarEstado(...)`. **No se puede mockear el mismo objeto cuyo comportamiento se quiere probar.**

### `tests/estados/hambriento.test.ts` – el estado decide la transición

Acá la situación se invierte: el `Hambriento` es **real** y la `Mascota` es un mock. Así se puede observar qué le pide el estado a la mascota.

* **"Verifica que la mascota cambie a estado Contento cuando come"**:
  1. Se reemplaza `instanciarEstadoContento()` con un spy que devuelve un `Contento` mockeado (`contento`). De esta forma se controla exactamente qué objeto crea el estado.
  2. Se llama a `instance.comer()`.
  3. Se verifica que se usó el método de creación y que la mascota recibió `cambiarEstado(contento)`, es decir, **ese** objeto y no otro.

  Así se comprueba la transición **Hambriento → Contento** sin consultar el estado de la mascota: alcanza con verificar el mensaje `cambiarEstado` que se le envió.

* **"Verifica que la mascota no puede jugar en el estado Hambriento"**: usa `expect(() => instance.jugar()).toThrow(...)`. Es importante pasar una **función** a `expect` y no el resultado de `instance.jugar()`. Si no, la excepción se lanza antes de que Jest pueda capturarla.

#### Sobre el spy en `instanciarEstadoContento`

`instanciarEstadoContento()` es un método **de instancia**. Por eso el spy se aplica sobre `instance` y no sobre la clase `Hambriento`. 

Además, el método es `private`, así que TypeScript no permite nombrarlo desde el test. Para eso se usa:

* `jest.spyOn(instance as any, "instanciarEstadoContento")` para crear el spy.
* `instance["instanciarEstadoContento"]` (acceso con corchetes) para la aserción, que TypeScript permite aunque el miembro sea privado.

El spy funciona porque `comer()` invoca `this.instanciarEstadoContento()`, y `this` es justamente el objeto sobre el que se reemplazó el método.

## Pendientes y observaciones

* **Faltan tests para `Contento` y `Aburrido`.** Para `Contento`, alcanza con verificar que `mascota.incrementarFelicidad` se llama sin argumento al comer y con `2` al jugar. Para `Aburrido`, la regla de los 80 minutos depende de `Date.now()`, así que conviene usar `jest.useFakeTimers()` y `jest.setSystemTime(...)` o `jest.advanceTimersByTime(...)` para simular el paso del tiempo sin esperar.
* **Mocks compartidos entre tests.** Los mocks se crean una sola vez, al declarar las variables. Las llamadas registradas se acumulan entre tests, así que aserciones como `toHaveBeenCalledTimes(1)` o `not.toHaveBeenCalled()` pueden fallar al agregar más casos. Conviene crearlos dentro del `beforeEach`.

## Cómo ejecutar las pruebas

```bash
user@host:~$ npm install
user@host:~$ npm test
```

`npm test` limpia, ejecuta el linter, compila y después corre Jest con cobertura. Para correr solo los tests, sin el build previo:

```bash
user@host:~$ npx jest tests
```
