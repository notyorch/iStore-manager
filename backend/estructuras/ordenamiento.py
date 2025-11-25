from .lista_doble import ListaDobleEnlazada

def bubble_sort_lista_doble(lista_doble):
    """
    Algoritmo de Ordenamiento 1: Bubble Sort
    Ordena la Lista Doble Enlazada intercambiando los datos de los nodos.
    Criterio: Precio (Ascendente).
    """
    if lista_doble.esta_vacia() or lista_doble.cabeza == lista_doble.cola:
        return

    cambio = True
    while cambio:
        cambio = False
        actual = lista_doble.cabeza
        while actual and actual.siguiente:
            if actual.dato.precio > actual.siguiente.dato.precio:
                # Intercambiar datos
                actual.dato, actual.siguiente.dato = actual.siguiente.dato, actual.dato
                cambio = True
            actual = actual.siguiente

def quick_sort_python_list(lista_celulares):
    """
    Algoritmo de Ordenamiento 2: Quick Sort
    Ordena una lista estándar de Python (obtenida de la lista enlazada).
    Criterio: Modelo (Alfabético).
    """
    if len(lista_celulares) <= 1:
        return lista_celulares
    
    pivote = lista_celulares[len(lista_celulares) // 2]
    izquierda = [x for x in lista_celulares if x.modelo < pivote.modelo]
    medio = [x for x in lista_celulares if x.modelo == pivote.modelo]
    derecha = [x for x in lista_celulares if x.modelo > pivote.modelo]
    
    return quick_sort_python_list(izquierda) + medio + quick_sort_python_list(derecha)
