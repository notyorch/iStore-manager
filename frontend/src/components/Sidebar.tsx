import { Package, ShoppingCart, Clock, BarChart3, Settings } from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onSettingsClick: () => void;
  isDarkMode: boolean;
}

export function Sidebar({ activeView, onViewChange, onSettingsClick, isDarkMode }: SidebarProps) {
  const menuItems = [
    { id: "inventory", label: "Inventario", icon: Package },
    { id: "sales", label: "Ventas", icon: ShoppingCart },
    { id: "history", label: "Historial", icon: Clock },
    { id: "reports", label: "Reportes", icon: BarChart3 },
  ];

  return (
    <aside className={`w-64 ${isDarkMode ? "bg-[#161616]" : "bg-white"} border-r ${isDarkMode ? "border-gray-800" : "border-gray-200"} flex flex-col`}>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#3A86FF] flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>iStore Manager</span>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-[#3A86FF] text-white"
                  : isDarkMode
                    ? "text-gray-400 hover:bg-[#282828] hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={`p-3 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
        <button
          onClick={onSettingsClick}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:bg-[#282828] hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Configuración</span>
        </button>
      </div>
    </aside>
  );
}
