from modelo import Celular

class Nodo:
    def __init__(self, dato):
        self.dato = dato  # Objeto Celular
        self.siguiente = None
        self.anterior = None

class ListaDobleEnlazada:
    def __init__(self):
        self.cabeza = None
        self.cola = None
        self.tamano = 0

    def esta_vacia(self):
        return self.cabeza is None

    def agregar_al_final(self, celular):
        nuevo_nodo = Nodo(celular)
        if self.esta_vacia():
            self.cabeza = nuevo_nodo
            self.cola = nuevo_nodo
        else:
            nuevo_nodo.anterior = self.cola
            self.cola.siguiente = nuevo_nodo
            self.cola = nuevo_nodo
        self.tamano += 1

    def eliminar_por_id(self, id_celular):
        actual = self.cabeza
        while actual:
            if actual.dato.id == id_celular:
                # Caso 1: Único nodo
                if actual == self.cabeza and actual == self.cola:
                    self.cabeza = None
                    self.cola = None
                # Caso 2: Cabeza
                elif actual == self.cabeza:
                    self.cabeza = actual.siguiente
                    self.cabeza.anterior = None
                # Caso 3: Cola
                elif actual == self.cola:
                    self.cola = actual.anterior
                    self.cola.siguiente = None
                # Caso 4: Nodo intermedio
                else:
                    actual.anterior.siguiente = actual.siguiente
                    actual.siguiente.anterior = actual.anterior
                
                self.tamano -= 1
                return actual.dato # Retornamos el dato eliminado (útil para Pila deshacer)
            actual = actual.siguiente
        return None # No encontrado

    def buscar_por_id(self, id_celular):
        actual = self.cabeza
        while actual:
            if actual.dato.id == id_celular:
                return actual.dato
            actual = actual.siguiente
        return None

    def convertir_a_lista_python(self):
        # Útil para algoritmos de ordenamiento que requieren acceso por índice o slicing fácil
        lista = []
        actual = self.cabeza
        while actual:
            lista.append(actual.dato)
            actual = actual.siguiente
        return lista

    def imprimir_inventario(self):
        print(f"\n--- Inventario ({self.tamano} equipos) ---")
        actual = self.cabeza
        while actual:
            print(actual.dato)
            actual = actual.siguiente
        print("----------------------------------\n")
