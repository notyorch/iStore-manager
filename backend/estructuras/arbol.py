class NodoArbol:
    def __init__(self, celular):
        self.celular = celular
        self.izquierda = None
        self.derecha = None

class ArbolBinarioBusqueda:
    """BST para búsquedas rápidas por PRECIO"""
    def __init__(self):
        self.raiz = None

    def insertar(self, celular):
        if self.raiz is None:
            self.raiz = NodoArbol(celular)
        else:
            self._insertar_recursivo(self.raiz, celular)

    def _insertar_recursivo(self, nodo_actual, celular):
        # Ordenamos por precio
        if celular.precio < nodo_actual.celular.precio:
            if nodo_actual.izquierda is None:
                nodo_actual.izquierda = NodoArbol(celular)
            else:
                self._insertar_recursivo(nodo_actual.izquierda, celular)
        else:
            if nodo_actual.derecha is None:
                nodo_actual.derecha = NodoArbol(celular)
            else:
                self._insertar_recursivo(nodo_actual.derecha, celular)

    def buscar_por_rango_precio(self, min_precio, max_precio):
        resultados = []
        self._buscar_rango_recursivo(self.raiz, min_precio, max_precio, resultados)
        return resultados

    def _buscar_rango_recursivo(self, nodo, min_p, max_p, lista_res):
        if nodo is None:
            return
        
        # Si el precio del nodo es mayor que el mínimo, buscamos a la izquierda
        if nodo.celular.precio > min_p:
            self._buscar_rango_recursivo(nodo.izquierda, min_p, max_p, lista_res)
        
        # Si está en el rango, lo agregamos
        if min_p <= nodo.celular.precio <= max_p:
            lista_res.append(nodo.celular)
            
        # Si el precio del nodo es menor que el máximo, buscamos a la derecha
        if nodo.celular.precio < max_p:
            self._buscar_rango_recursivo(nodo.derecha, min_p, max_p, lista_res)
