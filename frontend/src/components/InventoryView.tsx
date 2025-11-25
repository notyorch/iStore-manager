import { useState } from "react";
import { Search, Plus, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Phone } from "../services/api";

interface InventoryViewProps {
  phones: Phone[];
  onEditPhone: (phone: Phone) => void;
  onDeletePhone: (id: number) => void;
  onAddPhone: () => void;
  isDarkMode?: boolean;
  currency: "MXN" | "USD";
  exchangeRate: number;
}

type SortKey = "id" | "modelo" | "capacidad" | "condicion" | "precio" | "estado";
type SortDirection = "asc" | "desc";

export function InventoryView({ phones, onEditPhone, onDeletePhone, onAddPhone, isDarkMode = true, currency, exchangeRate }: InventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: "id", direction: "asc" });

  const getModelRank = (model: string) => {
    if (model.includes("16")) return 16;
    if (model.includes("15")) return 15;
    if (model.includes("14")) return 14;
    if (model.includes("13")) return 13;
    if (model.includes("12")) return 12;
    if (model.includes("11")) return 11;
    return 0;
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredPhones = phones
    .filter((phone) => {
      const matchesSearch = phone.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           phone.id.toString().includes(searchQuery.toLowerCase());
      const matchesCondition = conditionFilter === "todos" || phone.condicion === conditionFilter;
      const matchesStatus = statusFilter === "todos" || phone.estado === statusFilter;
      return matchesSearch && matchesCondition && matchesStatus;
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      let comparison = 0;

      if (key === "modelo") {
        const rankA = getModelRank(a.modelo);
        const rankB = getModelRank(b.modelo);
        if (rankA !== rankB) {
          comparison = rankA - rankB;
        } else {
          comparison = a.modelo.localeCompare(b.modelo);
        }
      } else if (typeof a[key] === "string") {
        comparison = (a[key] as string).localeCompare(b[key] as string);
      } else {
        comparison = (a[key] as number) - (b[key] as number);
      }

      return direction === "asc" ? comparison : -comparison;
    });

  const formatPrice = (price: number) => {
    const finalPrice = currency === "USD" ? price * exchangeRate : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(finalPrice);
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-500 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-[#3A86FF]" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-[#3A86FF]" />
    );
  };

  const renderHeader = (label: string, key: SortKey) => (
    <th 
      className="px-6 py-3 text-left text-sm text-gray-400 font-medium cursor-pointer hover:text-white transition-colors select-none"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon columnKey={key} />
      </div>
    </th>
  );

  return (
    <div className="p-8 flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`mb-6 text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Inventario</h1>

        {/* Action Bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por modelo, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${isDarkMode ? "bg-[#282828] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>
          <Button onClick={onAddPhone} className="bg-[#3A86FF] hover:bg-[#2f6fd8]">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Celular
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Condición:</span>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className={`w-40 ${isDarkMode ? "bg-[#282828] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Nuevo">Nuevo</SelectItem>
                <SelectItem value="Seminuevo">Seminuevo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Estado:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`w-40 ${isDarkMode ? "bg-[#282828] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="Vendido">Vendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`flex-1 rounded-lg overflow-hidden border ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"} flex flex-col`}>    
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full">
            <thead className={`sticky top-0 z-10 ${isDarkMode ? "bg-[#1C1C1C]" : "bg-gray-50"}`}>
              <tr>
                {renderHeader("ID", "id")}
                {renderHeader("Modelo", "modelo")}
                {renderHeader("Capacidad", "capacidad")}
                {renderHeader("Condición", "condicion")}
                {renderHeader("Precio", "precio")}
                {renderHeader("Estado", "estado")}
                <th className="px-6 py-3 text-left text-sm text-gray-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPhones.map((phone) => (
                <tr
                  key={phone.id}
                  className={`border-t ${isDarkMode ? "border-gray-700 hover:bg-[#1C1C1C]" : "border-gray-200 hover:bg-gray-50"} transition-colors group`}
                >
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>#{phone.id}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{phone.modelo}</td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>{phone.capacidad}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      phone.condicion === "Nuevo"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {phone.condicion}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>{formatPrice(phone.precio)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      phone.estado === "Disponible"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {phone.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditPhone(phone)}
                        className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-[#3A86FF] text-gray-400 hover:text-white" : "hover:bg-[#3A86FF] text-gray-500 hover:text-white"}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePhone(phone.id)}
                        className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-red-500 text-gray-400 hover:text-white" : "hover:bg-red-500 text-gray-500 hover:text-white"}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
