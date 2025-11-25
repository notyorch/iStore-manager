import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { InventoryView } from "./components/InventoryView";
import { SalesView } from "./components/SalesView";
import { HistoryView } from "./components/HistoryView";
import { ReportsView } from "./components/ReportsView";
import { SettingsModal } from "./components/SettingsModal";
import { AddEditModal } from "./components/AddEditModal";
import { api, Phone } from "./services/api";

interface Customer {
  id: number;
  name: string;
  interestedIn: string;
}

interface HistoryItem {
  id: number;
  modelo: string;
  action: string;
  timestamp: string;
}

export default function App() {
  const [activeView, setActiveView] = useState("inventory");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [currency, setCurrency] = useState<"MXN" | "USD">("MXN");
  const EXCHANGE_RATE = 0.05; // 1 MXN = 0.05 USD (approx 20 MXN = 1 USD)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  // Data from API
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await api.getInventory();
      setPhones(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  };

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "Juan Pérez", interestedIn: "iPhone 15 Pro Max 256GB" },
    { id: 2, name: "María González", interestedIn: "iPhone 14 Pro 128GB" },
    { id: 3, name: "Carlos Rodríguez", interestedIn: "iPhone 15 512GB" },
  ]);

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 1,
      modelo: "iPhone 15 Pro Max 256GB",
      action: "Vendido",
      timestamp: "Hace 2 horas",
    },
    {
      id: 2,
      modelo: "iPhone 14 128GB",
      action: "Eliminado",
      timestamp: "Hace 5 horas",
    },
    {
      id: 3,
      modelo: "iPhone 13 Pro 512GB",
      action: "Vendido",
      timestamp: "Hace 1 día",
    },
  ]);

  const handleEditPhone = (phone: Phone) => {
    setEditingPhone(phone);
    setIsModalOpen(true);
  };

  const handleSavePhone = async (phoneData: Omit<Phone, "id" | "estado"> & { id?: number }) => {
    try {
      if (phoneData.id) {
        // Edit existing
        await api.updatePhone(phoneData.id, phoneData);
        addLog(`Editado: ${phoneData.modelo} (ID: ${phoneData.id})`);
      } else {
        // Add new
        const newPhone = await api.addPhone(phoneData);
        addLog(`Agregado: ${newPhone.modelo} (ID: ${newPhone.id})`);
      }
      loadInventory(); // Reload data
      setIsModalOpen(false); // Close modal if open
    } catch (error) {
      console.error("Error saving phone:", error);
      addLog(`ERROR: Fallo al guardar celular - ${error}`);
    }
  };

  const handleDeletePhone = async (id: number) => {
    try {
      await api.deletePhone(id);
      loadInventory();
      
      // Add to local history for UI feedback (optional, or fetch history from backend if available)
      const phone = phones.find((p) => p.id === id);
      if (phone) {
        addLog(`Eliminado: ${phone.modelo} (ID: ${id})`);
        setHistory((prev) => [
          {
            id: Date.now(),
            modelo: `${phone.modelo} ${phone.capacidad}`,
            action: "Eliminado",
            timestamp: "Justo ahora",
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error("Error deleting phone:", error);
      addLog(`ERROR: Fallo al eliminar celular - ${error}`);
    }
  };

  const handleAttendNext = () => {
    if (customers.length > 0) {
      const nextCustomer = customers[0];
      setCustomers((prev) => prev.slice(1));
      addLog(`Atendido: ${nextCustomer.name} - ${nextCustomer.interestedIn}`);
      setHistory((prev) => [
        {
          id: Date.now(),
          modelo: nextCustomer.interestedIn,
          action: `Vendido a ${nextCustomer.name}`,
          timestamp: "Justo ahora",
        },
        ...prev,
      ]);
    }
  };

  const handleUndoLast = async () => {
    try {
      const restored = await api.undoLastSale();
      loadInventory();
      addLog(`Deshacer: Restaurado ${restored.modelo} (ID: ${restored.id})`);
      if (history.length > 0) {
        setHistory((prev) => prev.slice(1));
      }
    } catch (error) {
      console.error("Error undoing last action:", error);
      addLog(`ERROR: Fallo al deshacer acción - ${error}`);
    }
  };

  // Calculate stats
  const totalInventory = phones.length;
  const totalSales = history.filter((h) => h.action.includes("Vendido")).length;
  const revenue = phones
    .filter((p) => p.estado === "Vendido")
    .reduce((sum, p) => sum + p.precio, 0);
  const availableStock = phones.filter((p) => p.estado === "Disponible").length;

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "bg-[#1C1C1C]" : "bg-gray-100"}`}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        onSettingsClick={() => setActiveView("settings")}
        isDarkMode={isDarkMode}
      />

      {activeView === "inventory" && (
        <InventoryView
          phones={phones}
          onEditPhone={handleEditPhone}
          onDeletePhone={handleDeletePhone}
          onAddPhone={() => setIsModalOpen(true)}
          isDarkMode={isDarkMode}
          currency={currency}
          exchangeRate={EXCHANGE_RATE}
        />
      )}

      {activeView === "sales" && (
        <SalesView customers={customers} onAttendNext={handleAttendNext} isDarkMode={isDarkMode} />
      )}

      {activeView === "history" && (
        <HistoryView history={history} onUndoLast={handleUndoLast} isDarkMode={isDarkMode} />
      )}

      {activeView === "reports" && (
        <ReportsView
          totalInventory={totalInventory}
          totalSales={totalSales}
          revenue={revenue}
          availableStock={availableStock}
          isDarkMode={isDarkMode}
        />
      )}

      <SettingsModal
        isOpen={activeView === "settings"}
        onClose={() => setActiveView("inventory")}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        logs={logs}
        currency={currency}
        onToggleCurrency={() => setCurrency(currency === "MXN" ? "USD" : "MXN")}
      />

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePhone}
        phone={editingPhone}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
