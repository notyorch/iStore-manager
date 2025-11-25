import { X, Moon, Sun, Terminal, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useEffect, useRef } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  logs: string[];
  currency: "MXN" | "USD";
  onToggleCurrency: () => void;
}

export function SettingsModal({ isOpen, onClose, isDarkMode, onToggleDarkMode, logs, currency, onToggleCurrency }: SettingsModalProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)"
        }}
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl rounded-lg ${isDarkMode ? "bg-[#282828]" : "bg-white"} shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <h2 className={`flex items-center gap-2 text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <span>Configuración</span>
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-[#1C1C1C] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Appearance Section */}
          <div className="mb-6">
            <h3 className={`mb-4 flex items-center gap-2 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <span>Apariencia</span>
            </h3>
            <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? "bg-[#1C1C1C]" : "bg-gray-50"} mb-4`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? "bg-[#282828]" : "bg-white"}`}>
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-[#3A86FF]" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div>
                  <div className={`mb-1 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {isDarkMode ? "Modo Oscuro" : "Modo Claro"}
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {isDarkMode ? "Tema oscuro activado" : "Tema claro activado"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={onToggleDarkMode}
              />
            </div>

            {/* Currency Section */}
            <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? "bg-[#1C1C1C]" : "bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? "bg-[#282828]" : "bg-white"}`}>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className={`mb-1 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Moneda: {currency}
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {currency === "MXN" ? "Mostrando precios en Pesos Mexicanos" : "Mostrando precios en Dólares Americanos"}
                  </p>
                </div>
              </div>
              <Switch
                checked={currency === "USD"}
                onCheckedChange={onToggleCurrency}
              />
            </div>
          </div>

          {/* Log Section */}
          <div>
            <h3 className={`mb-4 flex items-center gap-2 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <Terminal className="w-5 h-5" />
              <span>Log de Cambios</span>
            </h3>
            <div 
              className={`rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs ${
                isDarkMode ? "bg-[#0D0D0D] border border-gray-800" : "bg-gray-100 border border-gray-200"
              }`}
            >
              {logs.length === 0 ? (
                <div className={`text-center py-20 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>
                  No hay registros de actividad
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`py-1 ${
                      log.includes("ERROR") 
                        ? "text-red-400" 
                        : log.includes("Agregado") || log.includes("Editado")
                        ? "text-green-400"
                        : log.includes("Eliminado") || log.includes("Atendido")
                        ? "text-yellow-400"
                        : log.includes("Modo")
                        ? "text-blue-400"
                        : isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
              Mostrando {logs.length} entradas del log del sistema
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 p-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <Button
            onClick={onClose}
            className="bg-[#3A86FF] hover:bg-[#2f6fd8]"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
