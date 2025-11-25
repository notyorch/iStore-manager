import os
import csv
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS

# Importar la lógica del proyecto anterior
from modelo import Celular
from estructuras.lista_doble import ListaDobleEnlazada
from estructuras.pila import Pila
from estructuras.cola import Cola
from estructuras.arbol import ArbolBinarioBusqueda
from estructuras.ordenamiento import bubble_sort_lista_doble, quick_sort_python_list
from datos.generador_datos import generar_csv

# --- Configuración de Logging ---
logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] %(message)s')

# --- Inicialización de la App Flask ---
app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir peticiones desde el frontend

# --- "Base de Datos" en Memoria ---
inventario = ListaDobleEnlazada()
historial_eliminados = Pila()
cola_pedidos = Cola()
indice_precios = ArbolBinarioBusqueda()
ARCHIVO_DATOS = os.path.join("datos", "inventario.csv")

# --- Funciones de Carga y Guardado ---
def cargar_datos():
    """Carga los datos del CSV a las estructuras en memoria."""
    global inventario, indice_precios
    # Limpiar estructuras antes de cargar
    inventario = ListaDobleEnlazada()
    indice_precios = ArbolBinarioBusqueda()
    
    try:
        with open(ARCHIVO_DATOS, mode='r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Saltar cabecera
            for row in reader:
                if row:
                    c = Celular(row[0], row[1], row[2], row[3], row[4], row[5])
                    if c.estado == "Disponible":
                        inventario.agregar_al_final(c)
                        indice_precios.insertar(c)
        logging.info(f"Carga exitosa. {inventario.tamano} equipos disponibles en memoria.")
    except FileNotFoundError:
        logging.warning("Archivo de datos no encontrado. Se generará uno nuevo.")
        generar_csv(50)
        if os.path.exists("inventario.csv"):
            os.replace("inventario.csv", ARCHIVO_DATOS)
        cargar_datos() # Volver a intentar la carga
    except Exception as e:
        logging.error(f"Error crítico cargando datos: {e}")

def guardar_datos():
    """Guarda el estado actual del inventario y vendidos en el CSV."""
    # Esta función es más compleja en un entorno real.
    # Por simplicidad, reescribiremos el archivo.
    logging.info("Iniciando guardado de datos en CSV...")
    todos_los_celulares = inventario.convertir_a_lista_python()
    
    # Podríamos añadir aquí los vendidos que están en la pila, etc.
    
    try:
        with open(ARCHIVO_DATOS, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(["ID", "Modelo", "Capacidad", "Condicion", "Precio", "Estado"])
            for celular in todos_los_celulares:
                writer.writerow(celular.to_csv_row())
        logging.info("Datos guardados correctamente en " + ARCHIVO_DATOS)
    except Exception as e:
        logging.error(f"Error guardando datos: {e}")


# --- Endpoints de la API ---

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    """Devuelve todo el inventario disponible."""
    lista_py = inventario.convertir_a_lista_python()
    # Convertir objetos a diccionarios para que sean serializables a JSON
    inventario_json = [c.__dict__ for c in lista_py]
    logging.debug(f"GET /api/inventory - Devolviendo {len(inventario_json)} items.")
    return jsonify(inventario_json)

@app.route('/api/inventory', methods=['POST'])
def add_inventory_item():
    """Agrega un nuevo celular al inventario."""
    data = request.json
    logging.debug(f"POST /api/inventory - Recibido: {data}")
    
    # En un sistema real, el ID sería autoincremental o un UUID.
    # Aquí usamos el tamaño actual + 1 como ID simple.
    new_id = inventario.tamano + 1 
    
    try:
        nuevo_celular = Celular(
            id=new_id,
            modelo=data['modelo'],
            capacidad=data['capacidad'],
            condicion=data['condicion'],
            precio=data['precio']
        )
        inventario.agregar_al_final(nuevo_celular)
        indice_precios.insertar(nuevo_celular)
        guardar_datos() # Persistir cambio
        logging.info(f"Nuevo celular agregado: {nuevo_celular}")
        return jsonify(nuevo_celular.__dict__), 201
    except KeyError as e:
        logging.error(f"Falta el campo {e} en la petición.")
        return jsonify({"error": f"Falta el campo {e}"}), 400

@app.route('/api/inventory/<int:item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    """Actualiza un celular del inventario."""
    data = request.json
    logging.debug(f"PUT /api/inventory/{item_id} - Recibido: {data}")
    
    # Buscar el nodo en la lista
    actual = inventario.cabeza
    celular_encontrado = None
    while actual:
        if actual.dato.id == item_id:
            celular_encontrado = actual.dato
            break
        actual = actual.siguiente
        
    if celular_encontrado:
        # Actualizar campos
        if 'modelo' in data: celular_encontrado.modelo = data['modelo']
        if 'capacidad' in data: celular_encontrado.capacidad = data['capacidad']
        if 'condicion' in data: celular_encontrado.condicion = data['condicion']
        if 'precio' in data: celular_encontrado.precio = data['precio']
        if 'estado' in data: celular_encontrado.estado = data['estado']
        
        guardar_datos()
        logging.info(f"Celular ID {item_id} actualizado.")
        return jsonify(celular_encontrado.__dict__)
    else:
        logging.warning(f"Intento de actualizar ID {item_id} no encontrado.")
        return jsonify({"error": "Item no encontrado"}), 404

@app.route('/api/inventory/<int:item_id>', methods=['DELETE'])
def sell_item(item_id):
    """Vende (elimina) un celular del inventario."""
    logging.debug(f"DELETE /api/inventory/{item_id}")
    
    celular_vendido = inventario.eliminar_por_id(item_id)
    
    if celular_vendido:
        celular_vendido.estado = "Vendido"
        historial_eliminados.push(celular_vendido)
        guardar_datos() # Persistir cambio
        logging.info(f"Celular ID {item_id} vendido y movido al historial.")
        return jsonify(celular_vendido.__dict__)
    else:
        logging.warning(f"Intento de eliminar ID {item_id} no encontrado.")
        return jsonify({"error": "Item no encontrado"}), 404

@app.route('/api/undo', methods=['POST'])
def undo_last_sale():
    """Deshace la última venta/eliminación."""
    logging.debug("POST /api/undo")
    celular_recuperado = historial_eliminados.pop()
    
    if celular_recuperado:
        celular_recuperado.estado = "Disponible"
        inventario.agregar_al_final(celular_recuperado)
        indice_precios.insertar(celular_recuperado) # Re-indexar
        guardar_datos()
        logging.info(f"Acción deshecha. Recuperado: {celular_recuperado}")
        return jsonify(celular_recuperado.__dict__)
    else:
        logging.warning("No hay acciones en el historial para deshacer.")
        return jsonify({"error": "No hay nada que deshacer"}), 404

@app.route('/api/inventory/sorted', methods=['GET'])
def get_sorted_inventory():
    """Devuelve el inventario ordenado usando algoritmos específicos."""
    algo = request.args.get('algorithm', 'quick') # 'bubble' or 'quick'
    
    if algo == 'bubble':
        # Ordenar la lista enlazada in-place por precio
        # Nota: Esto modifica el orden interno de la lista en memoria
        bubble_sort_lista_doble(inventario)
        lista_py = inventario.convertir_a_lista_python()
        logging.info("Inventario ordenado por Precio usando Bubble Sort.")
    else:
        # Ordenar usando Quick Sort (por modelo) sin modificar la lista enlazada original
        lista_base = inventario.convertir_a_lista_python()
        lista_py = quick_sort_python_list(lista_base)
        logging.info("Inventario ordenado por Modelo usando Quick Sort.")
        
    return jsonify([c.__dict__ for c in lista_py])

# --- Main ---
if __name__ == '__main__':
    cargar_datos()
    # El puerto 5000 es estándar para Flask
    app.run(debug=True, port=5000)
