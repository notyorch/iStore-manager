import { Button } from "./ui/button";
import { UserCircle2, ChevronRight } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  interestedIn: string;
}

interface SalesViewProps {
  customers: Customer[];
  onAttendNext: () => void;
  isDarkMode?: boolean;
}

export function SalesView({ customers, onAttendNext, isDarkMode = true }: SalesViewProps) {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className={`mb-2 text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Cola de Pedidos de Clientes</h1>
        <p className="text-gray-400 text-sm">Clientes en espera: {customers.length}</p>
      </div>

      {customers.length > 0 ? (
        <>
          <div className={`rounded-lg overflow-hidden border ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"} mb-6`}>
            <div className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
              {customers.map((customer, index) => (
                <div
                  key={customer.id}
                  className={`p-4 flex items-center gap-4 ${
                    index === 0
                      ? "bg-[#3A86FF]/10 border-l-4 border-[#3A86FF]"
                      : isDarkMode ? "hover:bg-[#1C1C1C]" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index === 0
                      ? "bg-[#3A86FF] text-white"
                      : isDarkMode ? "bg-[#1C1C1C] text-gray-400" : "bg-gray-100 text-gray-600"
                  }`}>
                    {index + 1}
                  </div>
                  <UserCircle2 className="w-10 h-10 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`${index === 0 ? (isDarkMode ? "text-white" : "text-gray-900") : "text-gray-400"} font-medium`}>{customer.name}</span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[#3A86FF] text-white">
                          Siguiente
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Interesado en: {customer.interestedIn}</p>
                  </div>
                  {index === 0 && (
                    <ChevronRight className="w-5 h-5 text-[#3A86FF]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={onAttendNext}
            className="bg-[#3A86FF] hover:bg-[#2f6fd8] w-full py-6"
          >
            Atender Siguiente Cliente
          </Button>
        </>
      ) : (
        <div className={`rounded-lg border ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"} p-12 text-center`}> 
          <UserCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-gray-400 mb-2">No hay clientes en cola</h3>
          <p className="text-gray-500 text-sm">Los nuevos clientes aparecerán aquí</p>
        </div>
      )}
    </div>
  );
}
