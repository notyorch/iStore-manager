class Celular:
    def __init__(self, id, modelo, capacidad, condicion, precio, estado="Disponible"):
        self.id = int(id)
        self.modelo = modelo
        self.capacidad = capacidad
        self.condicion = condicion
        self.precio = float(precio)
        self.estado = estado

    def __str__(self):
        return f"[{self.id}] {self.modelo} ({self.capacidad}) - {self.condicion} - ${self.precio:.2f} [{self.estado}]"
    
    def to_csv_row(self):
        return [self.id, self.modelo, self.capacidad, self.condicion, self.precio, self.estado]
