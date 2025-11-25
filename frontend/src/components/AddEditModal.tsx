import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Phone } from "../services/api";

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phone: Omit<Phone, "id" | "estado">) => void;
  phone: Phone | null;
  isDarkMode: boolean;
}

export function AddEditModal({ isOpen, onClose, onSave, phone, isDarkMode }: AddEditModalProps) {
  const [modelo, setModelo] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [condicion, setCondicion] = useState("Nuevo");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    if (phone) {
      setModelo(phone.modelo);
      setCapacidad(phone.capacidad);
      setCondicion(phone.condicion);
      setPrecio(phone.precio.toString());
    } else {
      setModelo("");
      setCapacidad("");
      setCondicion("Nuevo");
      setPrecio("");
    }
  }, [phone, isOpen]);

  if (!isOpen) return null;

  const isValid = modelo !== "" && capacidad !== "" && precio !== "" && parseFloat(precio) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    onSave({
      modelo,
      capacidad,
      condicion,
      precio: parseFloat(precio),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-lg p-6 ${isDarkMode ? "bg-[#282828]" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{phone ? "Editar Celular" : "Agregar Nuevo Celular"}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-[#1C1C1C] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="modelo" className={isDarkMode ? "text-gray-400" : "text-gray-700"}>Modelo</Label>
            <Select value={modelo} onValueChange={setModelo} required>
              <SelectTrigger className={`mt-1 ${isDarkMode ? "bg-[#1C1C1C] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                <SelectValue placeholder="Selecciona un modelo" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="iPhone 16 Pro Max">iPhone 16 Pro Max</SelectItem>
                <SelectItem value="iPhone 16 Pro">iPhone 16 Pro</SelectItem>
                <SelectItem value="iPhone 16 Plus">iPhone 16 Plus</SelectItem>
                <SelectItem value="iPhone 16">iPhone 16</SelectItem>
                <SelectItem value="iPhone 15 Pro Max">iPhone 15 Pro Max</SelectItem>
                <SelectItem value="iPhone 15 Pro">iPhone 15 Pro</SelectItem>
                <SelectItem value="iPhone 15 Plus">iPhone 15 Plus</SelectItem>
                <SelectItem value="iPhone 15">iPhone 15</SelectItem>
                <SelectItem value="iPhone 14 Pro Max">iPhone 14 Pro Max</SelectItem>
                <SelectItem value="iPhone 14 Pro">iPhone 14 Pro</SelectItem>
                <SelectItem value="iPhone 14 Plus">iPhone 14 Plus</SelectItem>
                <SelectItem value="iPhone 14">iPhone 14</SelectItem>
                <SelectItem value="iPhone 13 Pro Max">iPhone 13 Pro Max</SelectItem>
                <SelectItem value="iPhone 13 Pro">iPhone 13 Pro</SelectItem>
                <SelectItem value="iPhone 13">iPhone 13</SelectItem>
                <SelectItem value="iPhone 13 Mini">iPhone 13 Mini</SelectItem>
                <SelectItem value="iPhone 12 Pro Max">iPhone 12 Pro Max</SelectItem>
                <SelectItem value="iPhone 12 Pro">iPhone 12 Pro</SelectItem>
                <SelectItem value="iPhone 12">iPhone 12</SelectItem>
                <SelectItem value="iPhone 12 Mini">iPhone 12 Mini</SelectItem>
                <SelectItem value="iPhone 11 Pro Max">iPhone 11 Pro Max</SelectItem>
                <SelectItem value="iPhone 11 Pro">iPhone 11 Pro</SelectItem>
                <SelectItem value="iPhone 11">iPhone 11</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="capacidad" className={isDarkMode ? "text-gray-400" : "text-gray-700"}>Capacidad</Label>
            <Select value={capacidad} onValueChange={setCapacidad} required>
              <SelectTrigger className={`mt-1 ${isDarkMode ? "bg-[#1C1C1C] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                <SelectValue placeholder="Selecciona la capacidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="64GB">64GB</SelectItem>
                <SelectItem value="128GB">128GB</SelectItem>
                <SelectItem value="256GB">256GB</SelectItem>
                <SelectItem value="512GB">512GB</SelectItem>
                <SelectItem value="1TB">1TB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={`mb-2 block ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Condición</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCondicion("Nuevo")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  condicion === "Nuevo"
                    ? "bg-[#3A86FF] border-[#3A86FF] text-white"
                    : isDarkMode
                    ? "bg-[#1C1C1C] border-gray-700 hover:border-gray-600 text-white"
                    : "bg-white border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
              >
                Nuevo
              </button>
              <button
                type="button"
                onClick={() => setCondicion("Seminuevo")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  condicion === "Seminuevo"
                    ? "bg-[#3A86FF] border-[#3A86FF] text-white"
                    : isDarkMode
                    ? "bg-[#1C1C1C] border-gray-700 hover:border-gray-600 text-white"
                    : "bg-white border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
              >
                Seminuevo
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="precio" className={isDarkMode ? "text-gray-400" : "text-gray-700"}>Precio (MXN)</Label>
            <Input
              id="precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="24999"
              required
              className={`mt-1 ${isDarkMode ? "bg-[#1C1C1C] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className={`flex-1 ${isDarkMode ? "bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className={`flex-1 ${!isValid ? "opacity-50 cursor-not-allowed" : ""} bg-[#3A86FF] hover:bg-[#2f6fd8] text-white`}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
