import { Button } from "./ui/button";
import { Clock, RotateCcw, Trash2 } from "lucide-react";

interface HistoryItem {
  id: number;
  modelo: string;
  action: string;
  timestamp: string;
}

interface HistoryViewProps {
  history: HistoryItem[];
  onUndoLast: () => void;
  isDarkMode?: boolean;
}

export function HistoryView({ history, onUndoLast, isDarkMode = true }: HistoryViewProps) {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className={`mb-2 text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Historial de Ventas / Papelera</h1>
        <p className="text-gray-400 text-sm">Acciones recientes: {history.length}</p>
      </div>

      {history.length > 0 ? (
        <>
          <div className={`rounded-lg overflow-hidden border ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"} mb-6`}>
            <div className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
              {history.map((item, index) => {
                const isSale = item.action.toLowerCase().includes("vendido");
                return (
                  <div
                    key={item.id}
                    className={`p-4 flex items-center gap-4 ${
                      index === 0
                        ? "bg-yellow-500/10 border-l-4 border-yellow-500"
                        : isDarkMode ? "hover:bg-[#1C1C1C]" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isSale
                        ? "bg-green-500/20"
                        : "bg-red-500/20"
                    }`}>
                      {isSale ? (
                        <Clock className={`w-5 h-5 ${isSale ? "text-green-400" : "text-red-400"}`} />
                      ) : (
                        <Trash2 className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${index === 0 ? "text-white" : "text-gray-400"} font-medium`}>{item.modelo}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          isSale
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {item.action}
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 rounded text-xs bg-yellow-500 text-black">
                            Más reciente
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Fecha: {item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            onClick={onUndoLast}
            className="bg-yellow-500 hover:bg-yellow-600 text-black w-full py-6"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Deshacer Última Acción
          </Button>
        </>
      ) : (
        <div className={`rounded-lg border ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"} p-12 text-center`}> 
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-gray-400 mb-2">No hay historial</h3>
          <p className="text-gray-500 text-sm">Las acciones recientes aparecerán aquí</p>
        </div>
      )}
    </div>
  );
}
