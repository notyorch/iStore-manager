import csv
import random

# Configuración de generación
MODELOS = [
    ("iPhone 11", 7000), ("iPhone 11 Pro", 8500), ("iPhone 11 Pro Max", 9500),
    ("iPhone 12", 9000), ("iPhone 12 Pro", 11000), ("iPhone 12 Pro Max", 12000),
    ("iPhone 13", 11000), ("iPhone 13 Pro", 14000), ("iPhone 13 Pro Max", 16000),
    ("iPhone 14", 13000), ("iPhone 14 Pro", 17000), ("iPhone 14 Pro Max", 19000),
    ("iPhone 15", 16000), ("iPhone 15 Pro", 21000), ("iPhone 15 Pro Max", 24000),
    ("iPhone 16", 19000), ("iPhone 16 Pro", 25000), ("iPhone 16 Pro Max", 28000),
    ("iPhone 17", 22000), ("iPhone 17 Pro", 29000), ("iPhone 17 Pro Max", 32000)
]

CAPACIDADES = ["64GB", "128GB", "256GB", "512GB", "1TB"]
CONDICIONES = ["Nuevo", "Seminuevo"]
ESTADOS = ["Disponible", "Reservado", "Vendido"]

def generar_csv(cantidad=50):
    ruta_archivo = "inventario.csv"
    with open(ruta_archivo, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["ID", "Modelo", "Capacidad", "Condicion", "Precio", "Estado"])
        
        for i in range(1, cantidad + 1):
            modelo, precio_base = random.choice(MODELOS)
            capacidad = random.choice(CAPACIDADES)
            condicion = random.choice(CONDICIONES)
            
            # Ajuste de precio
            precio = precio_base
            if "Pro" in modelo: precio += 2000
            if capacidad == "256GB": precio += 1500
            elif capacidad == "512GB": precio += 3000
            elif capacidad == "1TB": precio += 5000
            
            if condicion == "Seminuevo":
                precio = precio * 0.75  # 25% descuento
            
            estado = "Disponible" # Inicialmente todos disponibles
            
            writer.writerow([i, modelo, capacidad, condicion, round(precio, 2), estado])
    
    print(f"Archivo {ruta_archivo} generado con {cantidad} registros.")

if __name__ == "__main__":
    generar_csv()
