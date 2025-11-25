<h1>
  <img src="frontend/public/logo.png" alt="Logo" width="40" style="vertical-align:middle; margin-right:10px;" />
  iStore Manager
</h1>

[![Universidad UPY](https://img.shields.io/badge/Universidad-UPY-purple?logo=graduation-cap)](https://www.university.upy.edu.mx/)

[![GitHub - Jorge Vargas](https://img.shields.io/badge/GitHub-Jorge-lightgrey?logo=github)](https://github.com/notyorch)
[![GitHub - Jose Rejón](https://img.shields.io/badge/GitHub-José-lightgrey?logo=github)](https://github.com/userejon31)
[![GitHub - Saúl Ruiz](https://img.shields.io/badge/GitHub-Saúl-lightgrey?logo=github)](https://github.com/xSaulorz)
[![GitHub - William Fernández](https://img.shields.io/badge/GitHub-William-lightgrey?logo=github)](https://github.com/WillyyyFernandez)


## Descripción General

**iStore Manager** es una aplicación de escritorio para gestionar inventarios de iPhones (modelos 11 a 17 Pro Max). El sistema permite:
- 📊 Visualizar el inventario en tiempo real
- 🛒 Registrar ventas y eliminar productos
- 🔍 Buscar por rango de precios
- 📈 Generar reportes ordenados
- ↩️ Deshacer acciones (papelera)
- 👥 Gestionar cola de clientes

## Requisitos Previos

### Software Necesario
- **Python 3.8+** (con pip)
- **Node.js 16+** (con npm)
- **Windows, macOS o Linux**

### Verificar instalación
```bash
python --version
npm --version
```

## Instalación Rápida

### Paso 1: Clonar/Descargar el Proyecto
```bash
cd "ruta/al/proyecto/Entrega_2_Desarrollo"
```

### Paso 2: Instalar Dependencias de Python (Backend)
```bash
cd backend
pip install Flask Flask-CORS
cd ..
```

### Paso 3: Instalar Dependencias de Node (Frontend)
```bash
cd frontend
npm install
cd ..
```

## Ejecución

### Opción 1: Script Automatizado (Windows)
Simplemente haz **doble clic** en:
```
start-dev.bat
```

Esto abrirá dos terminales:
- Una para el backend de Python (puerto 5000)
- Otra para la aplicación de Electron

### Opción 2: Manual (Cualquier SO)

**Terminal 1 - Backend:**
```bash
cd backend
python api.py
```

Deberías ver:
```
[INFO] Carga exitosa. 50 equipos disponibles en memoria.
 * Running on http://127.0.0.1:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

La aplicación se abrirá en una ventana de escritorio.

## Estructura del Proyecto

```
Entrega_2_Desarrollo/
├── backend/
│   ├── api.py                    # Servidor API (Flask)
│   ├── modelo.py                 # Clase Celular
│   ├── estructuras/              # Estructuras de datos
│   │   ├── lista_doble.py        # Lista Enlazada Doble
│   │   ├── arbol.py              # Árbol Binario de Búsqueda
│   │   ├── pila.py               # Pila (Historial)
│   │   └── cola.py               # Cola (Pedidos)
│   └── datos/
│       ├── generador_datos.py    # Generador de datos CSV
│       └── inventario.csv        # Base de datos
│
├── frontend/
│   ├── main.js                   # Punto de entrada Electron
│   ├── preload.js               # Seguridad Electron
│   ├── renderer.js              # Lógica del UI
│   ├── index.html               # Interfaz HTML
│   ├── package.json
│   └── ... (assets, estilos)
│
└── start-dev.bat                # Script de inicio

```

## Funcionalidades Principales

### 📱 Dashboard de Inventario
- Tabla dinámica con todos los iPhones disponibles
- Columnas: ID, Modelo, Capacidad, Condición, Precio, Estado
- Acciones por fila: Editar, Vender/Eliminar

### 💰 Búsqueda Avanzada (Backend)
```
GET http://127.0.0.1:5000/api/inventory/search?min=5000&max=15000
```

### 🛒 Venta de Producto
```
DELETE http://127.0.0.1:5000/api/inventory/5
```

### ↩️ Deshacer Venta
```
POST http://127.0.0.1:5000/api/undo
```

## Datos de Prueba

El sistema genera automáticamente un archivo `datos/inventario.csv` con 50 iPhones en diferentes condiciones y precios.

**Ejemplo de datos generados:**
- iPhone 11: $5,250 (Seminuevo)
- iPhone 15 Pro Max: $18,000 (Nuevo)
- iPhone 17 Pro Max: $32,000 (Nuevo)

## Logs y Debugging

### Logs del Backend
Verás en la terminal del backend mensajes como:
```
[2025-11-19 17:30:45] [INFO] Carga exitosa. 50 equipos disponibles.
[2025-11-19 17:30:50] [DEBUG] GET /api/inventory - Devolviendo 50 items.
[2025-11-19 17:30:55] [INFO] Nuevo celular agregado: iPhone 14 Pro (256GB) - $17,000
```

### Logs del Frontend
Abre la consola de Electron con `F12` para ver logs de JavaScript.

## Solución de Problemas

### Error: "Port 5000 already in use"
Cambiar el puerto en `backend/api.py`:
```python
app.run(debug=True, port=5001)  # Cambiar a otro puerto
```

### Error: "Cannot find module 'electron'"
Reinstalar dependencias:
```bash
cd frontend
rm -r node_modules
npm install
npm start
```

### Error: "python: command not found"
Asegúrate de que Python esté instalado y en el PATH.

## Arquitectura Técnica

```
┌─────────────────────────────┐
│   Electron (Frontend)       │
│   - Interfaz Gráfica        │
│   - HTML/CSS/JavaScript     │
└────────────┬────────────────┘
             │ HTTP/JSON
┌────────────▼────────────────┐
│   Flask API (Backend)       │
│   - Endpoints REST          │
│   - Lógica de Datos         │
└────────────┬────────────────┘
             │ R/W
┌────────────▼────────────────┐
│   CSV (Persistencia)        │
│   - Almacenamiento          │
└─────────────────────────────┘
```

## Estructuras de Datos Implementadas

1. **Lista Doblemente Enlazada:** Inventario principal
2. **Árbol Binario de Búsqueda:** Índice de precios
3. **Pila:** Historial de eliminaciones (Undo)
4. **Cola:** Gestión de pedidos de clientes

## Algoritmos Implementados

1. **MergeSort:** Ordenamiento por precio (O(n log n))
2. **Búsqueda en Árbol:** Rango de precios (O(log n))

## Contribución y Mejoras Futuras

- Interfaz de reportes avanzada
- Exportar a PDF
- Base de datos SQL
- Autenticación de usuarios
- Estadísticas y gráficos

## Licencia

Proyecto académico. Uso libre.

---

Consulta los logs con la terminal del backend o con `F12`

