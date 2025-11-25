class NodoCola:
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None

class Cola:
    """Estructura FIFO (First In, First Out) para Pedidos de Clientes"""
    def __init__(self):
        self.frente = None
        self.final = None
        self.tamano = 0

    def encolar(self, dato):
        nuevo_nodo = NodoCola(dato)
        if self.final is None:
            self.frente = nuevo_nodo
            self.final = nuevo_nodo
        else:
            self.final.siguiente = nuevo_nodo
            self.final = nuevo_nodo
        self.tamano += 1

    def desencolar(self):
        if self.frente is None:
            return None
        dato = self.frente.dato
        self.frente = self.frente.siguiente
        if self.frente is None:
            self.final = None
        self.tamano -= 1
        return dato

    def mostrar_cola(self):
        print("\n--- Cola de Pedidos ---")
        actual = self.frente
        i = 1
        while actual:
            print(f"{i}. {actual.dato}")
            actual = actual.siguiente
            i += 1
        print("-----------------------\n")
