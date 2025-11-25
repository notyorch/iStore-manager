import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Package, ShoppingCart } from "lucide-react";

interface ReportsViewProps {
  totalInventory: number;
  totalSales: number;
  revenue: number;
  availableStock: number;
  isDarkMode?: boolean;
}

export function ReportsView({ totalInventory, totalSales, revenue, availableStock, isDarkMode = true }: ReportsViewProps) {
  const salesData = [
    { mes: "Jun", ventas: 12, ingresos: 289999 },
    { mes: "Jul", ventas: 18, ingresos: 389999 },
    { mes: "Ago", ventas: 15, ingresos: 329999 },
    { mes: "Sep", ventas: 22, ingresos: 479999 },
    { mes: "Oct", ventas: 19, ingresos: 419999 },
    { mes: "Nov", ventas: 25, ingresos: 549999 },
  ];

  const inventoryData = [
    { name: "Nuevo", value: 28, color: "#3A86FF" },
    { name: "Seminuevo", value: 14, color: "#FFB800" },
  ];

  const stats = [
    { label: "Ventas del Mes", value: totalSales.toString(), icon: ShoppingCart, color: "bg-green-500" },
    { label: "Ingresos Totales", value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: "bg-blue-500" },
    { label: "Inventario Total", value: totalInventory.toString(), icon: Package, color: "bg-purple-500" },
    { label: "Stock Disponible", value: availableStock.toString(), icon: TrendingUp, color: "bg-yellow-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className={`mb-2 text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Reportes</h1>
        <p className="text-gray-400 text-sm">Análisis de ventas e inventario</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg p-6 ${isDarkMode ? "bg-[#282828] border border-gray-700" : "bg-white border border-gray-200"}`}       
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl mb-1 text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className={`col-span-2 rounded-lg p-6 ${isDarkMode ? "bg-[#282828] border border-gray-700" : "bg-white border border-gray-200"}`}>                                                                                                                                                 <h3 className="mb-6 text-white">Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="mes" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#282828" : "#fff",
                  border: "1px solid #444",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="ventas" fill="#3A86FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Pie Chart */}
        <div className={`rounded-lg p-6 ${isDarkMode ? "bg-[#282828] border border-gray-700" : "bg-white border border-gray-200"}`}>       
          <h3 className="mb-6 text-white">Distribución de Inventario</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#282828" : "#fff",
                  border: "1px solid #444",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {inventoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm text-white">{item.value} unidades</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Models */}
      <div className={`mt-6 rounded-lg p-6 ${isDarkMode ? "bg-[#282828] border border-gray-700" : "bg-white border border-gray-200"}`}>    
        <h3 className="mb-4 text-white">Modelos Más Vendidos</h3>
        <div className="space-y-3">
          {[
            { modelo: "iPhone 15 Pro Max", ventas: 8, porcentaje: 32 },
            { modelo: "iPhone 15 Pro", ventas: 6, porcentaje: 24 },
            { modelo: "iPhone 15", ventas: 5, porcentaje: 20 },
            { modelo: "iPhone 14 Pro", ventas: 4, porcentaje: 16 },
            { modelo: "iPhone 14", ventas: 2, porcentaje: 8 },
          ].map((item, index) => (
            <div key={item.modelo} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-[#3A86FF] text-white text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{item.modelo}</span>
                  <span className="text-sm text-gray-400">{item.ventas} ventas</span>
                </div>
                <div className="w-full bg-[#1C1C1C] rounded-full h-2">
                  <div
                    className="bg-[#3A86FF] h-2 rounded-full"
                    style={{ width: `${item.porcentaje}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
