class NodoPila:
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None

class Pila:
    """Estructura LIFO (Last In, First Out) para Historial de Eliminados/Vistos"""
    def __init__(self):
        self.tope = None
        self.tamano = 0

    def push(self, dato):
        nuevo_nodo = NodoPila(dato)
        nuevo_nodo.siguiente = self.tope
        self.tope = nuevo_nodo
        self.tamano += 1

    def pop(self):
        if self.tope is None:
            return None
        dato = self.tope.dato
        self.tope = self.tope.siguiente
        self.tamano -= 1
        return dato

    def peek(self):
        if self.tope is None:
            return None
        return self.tope.dato

    def mostrar_historial(self):
        print("\n--- Historial (Pila) ---")
        actual = self.tope
        while actual:
            print(f"-> {actual.dato}")
            actual = actual.siguiente
        print("------------------------\n")

    def a_lista(self):
        elementos = []
        actual = self.tope
        while actual:
            elementos.append(actual.dato)
            actual = actual.siguiente
        return elementos
