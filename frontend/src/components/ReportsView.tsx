import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  LineChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, DollarSign, Package, ShoppingCart, Settings, Download, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { DashboardStats } from "../services/api";

interface ReportsViewProps {
  totalInventory: number;
  totalSales: number;
  revenue: number;
  availableStock: number;
  isDarkMode?: boolean;
  stats?: DashboardStats | null;
}

type MetricOption = "ventas" | "ingresos";
type TimeRangeOption = "3m" | "6m" | "12m";
type ChartTypeOption = "bar" | "line" | "area";
type ConditionOption = "all" | "nuevo" | "seminuevo" | "reacondicionado" | "otro";

interface SalesPoint {
  mes: string;
  ventas: number;
  ingresos: number;
  metaVentas: number;
  metaIngresos: number;
}

interface InventorySlice {
  name: string;
  key: ConditionOption;
  value: number;
  color: string;
}

const SALES_DATA: SalesPoint[] = [
  { mes: "Dic 24", ventas: 14, ingresos: 329_999, metaVentas: 12, metaIngresos: 310_000 },
  { mes: "Ene 25", ventas: 16, ingresos: 349_999, metaVentas: 15, metaIngresos: 330_000 },
  { mes: "Feb 25", ventas: 17, ingresos: 359_999, metaVentas: 16, metaIngresos: 340_000 },
  { mes: "Mar 25", ventas: 19, ingresos: 399_999, metaVentas: 18, metaIngresos: 380_000 },
  { mes: "Abr 25", ventas: 15, ingresos: 329_999, metaVentas: 16, metaIngresos: 340_000 },
  { mes: "May 25", ventas: 18, ingresos: 389_999, metaVentas: 17, metaIngresos: 360_000 },
  { mes: "Jun 25", ventas: 20, ingresos: 419_999, metaVentas: 19, metaIngresos: 400_000 },
  { mes: "Jul 25", ventas: 22, ingresos: 459_999, metaVentas: 20, metaIngresos: 420_000 },
  { mes: "Ago 25", ventas: 21, ingresos: 439_999, metaVentas: 20, metaIngresos: 430_000 },
  { mes: "Sep 25", ventas: 24, ingresos: 489_999, metaVentas: 22, metaIngresos: 460_000 },
  { mes: "Oct 25", ventas: 23, ingresos: 469_999, metaVentas: 22, metaIngresos: 450_000 },
  { mes: "Nov 25", ventas: 26, ingresos: 529_999, metaVentas: 24, metaIngresos: 500_000 },
];

const INVENTORY_SLICES: InventorySlice[] = [
  { name: "Nuevo", key: "nuevo", value: 28, color: "#3A86FF" },
  { name: "Seminuevo", key: "seminuevo", value: 14, color: "#FFB800" },
  { name: "Reacondicionado", key: "reacondicionado", value: 6, color: "#22C55E" },
];

const CONDITION_COLORS: Record<ConditionOption, string> = {
  all: "#6366F1",
  nuevo: "#3A86FF",
  seminuevo: "#FFB800",
  reacondicionado: "#22C55E",
  otro: "#8B5CF6",
};

const mapConditionToKey = (label: string): ConditionOption => {
  if (!label || typeof label !== 'string') return "otro";
  const normalized = label.toLowerCase();
  if (normalized.includes("semi")) return "seminuevo";
  if (normalized.includes("reacond")) return "reacondicionado";
  if (normalized.includes("nuevo")) return "nuevo";
  return "otro";
};

export function ReportsView({ totalInventory, totalSales, revenue, availableStock, isDarkMode = true, stats }: ReportsViewProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>("ventas");
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("6m");
  const [chartType, setChartType] = useState<ChartTypeOption>("bar");
  const [includeGoalBenchmark, setIncludeGoalBenchmark] = useState(true);
  const [comparePrevious, setComparePrevious] = useState(true);
  const [focusCondition, setFocusCondition] = useState<ConditionOption>("all");
  const [showPercentages, setShowPercentages] = useState(true);
  const [includeMarkdownSummary, setIncludeMarkdownSummary] = useState(true);

  const statsInventory = stats?.inventory;
  const statsSales = stats?.sales;

  const salesTotal = statsSales?.total ?? totalSales;
  const revenueTotal = statsSales?.revenue ?? revenue;
  const averageTicket = statsSales?.average_ticket ?? (salesTotal > 0 ? revenueTotal / salesTotal : 0);
  const conversionRate = statsInventory && statsSales
    ? Math.min(100, Math.round((statsSales.total / Math.max(statsInventory.total + statsSales.total, 1)) * 100))
    : Math.min(100, Math.round((salesTotal / Math.max(totalInventory + salesTotal, 1)) * 100));

  const salesData = SALES_DATA;
  const inventoryData = useMemo<InventorySlice[]>(() => {
    if (statsInventory && statsInventory.condition_distribution) {
      const entries = Object.entries(statsInventory.condition_distribution);
      if (entries.length > 0) {
        return entries.map(([label, value]) => {
          const key = mapConditionToKey(label);
          return {
            name: label,
            key,
            value: Number(value) || 0,
            color: CONDITION_COLORS[key] ?? "#94A3B8",
          };
        });
      }
    }
    return INVENTORY_SLICES;
  }, [statsInventory]);

  const rangeMap: Record<TimeRangeOption, number> = {
    "3m": 3,
    "6m": 6,
    "12m": 12,
  };

  const filteredSalesData = useMemo(() => {
    const months = rangeMap[timeRange];
    return salesData.slice(-months);
  }, [salesData, timeRange]);

  const chartData = useMemo(() =>
    filteredSalesData.map((item) => ({
      mes: item.mes,
      value: selectedMetric === "ventas" ? item.ventas : item.ingresos,
      meta: selectedMetric === "ventas" ? item.metaVentas : item.metaIngresos,
    })),
  [filteredSalesData, selectedMetric]);

  const averageValue = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length;
  }, [chartData]);

  const comparisonValue = useMemo(() => {
    if (!comparePrevious || chartData.length < 2) return null;
    const last = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    const diff = last.value - previous.value;
    const percent = previous.value === 0 ? 0 : (diff / previous.value) * 100;
    return { diff, percent };
  }, [chartData, comparePrevious]);

  const pieChartData = useMemo(() =>
    inventoryData.map((slice) => ({
      ...slice,
      opacity: focusCondition === "all" || slice.key === focusCondition ? 1 : 0.4,
    })),
  [inventoryData, focusCondition]);

  const filteredInventoryData = useMemo(() =>
    focusCondition === "all"
      ? inventoryData
      : inventoryData.filter((slice) => slice.key === focusCondition),
  [focusCondition, inventoryData]);

  const totalInventoryUnits = useMemo(
    () => inventoryData.reduce((sum, slice) => sum + slice.value, 0),
    [inventoryData],
  );

  const focusInventoryUnits = useMemo(
    () => filteredInventoryData.reduce((sum, slice) => sum + slice.value, 0),
    [filteredInventoryData],
  );

  const metricLabel = selectedMetric === "ventas" ? "Ventas" : "Ingresos";

  const chartValueFormatter = (value: number) => {
    if (selectedMetric === "ventas") {
      return `${Math.round(value)} unidades`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const averageDisplay = chartValueFormatter(averageValue);
  const lastPoint = chartData[chartData.length - 1];
  const metaGap = lastPoint ? lastPoint.value - lastPoint.meta : 0;

  const inventorySummary = focusCondition === "all"
    ? `${focusInventoryUnits} unidades totales`
    : `${focusInventoryUnits} unidades (${totalInventoryUnits === 0 ? 0 : Math.round((focusInventoryUnits / totalInventoryUnits) * 100)}% del inventario)`;

  const handleExportCsv = () => {
    if (!chartData.length) return;

    const headers = ["Mes", metricLabel];
    if (includeGoalBenchmark) headers.push("Meta");

    const rows = chartData.map((row) => {
      const base = [row.mes, Math.round(row.value).toString()];
      if (includeGoalBenchmark) base.push(Math.round(row.meta).toString());
      return base.join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_${selectedMetric}_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const markdownReport = useMemo(() => {
    if (!includeMarkdownSummary) return "";

    const title = `# Reporte ${metricLabel} (${timeRange === "3m" ? "Últimos 3 meses" : timeRange === "6m" ? "Últimos 6 meses" : "Últimos 12 meses"})`;
    const statsLines = [
      `- Ventas completadas: **${salesTotal}**`,
      `- Ingresos acumulados: **$${Math.round(revenueTotal).toLocaleString()}**`,
      `- Ticket promedio: **$${Math.round(averageTicket).toLocaleString()}**`,
      `- Conversión vs inventario: **${conversionRate}%**`,
    ];

    const tableHeader = includeGoalBenchmark
      ? "| Mes | Valor | Meta |\n| --- | ---: | ---: |"
      : "| Mes | Valor |\n| --- | ---: |";

    const tableRows = chartData
      .map((row) => {
        const value = chartValueFormatter(row.value).replace(/ unidades| \(.*\)/g, "");
        if (includeGoalBenchmark) {
          const meta = chartValueFormatter(row.meta).replace(/ unidades| \(.*\)/g, "");
          return `| ${row.mes} | ${value} | ${meta} |`;
        }
        return `| ${row.mes} | ${value} |`;
      })
      .join("\n");

    const totalInventoryForMarkdown = inventoryData.reduce((sum, slice) => sum + slice.value, 0);
    const inventoryLines = inventoryData.map((slice) => {
      const percent = totalInventoryForMarkdown === 0 ? 0 : Math.round((slice.value / totalInventoryForMarkdown) * 100);
      return `- ${slice.name}: **${slice.value} unidades** (${percent}%)`;
    });

    const insightsLines = [
      comparisonValue
        ? `- Tendencia reciente: ${comparisonValue.diff >= 0 ? "⬆️" : "⬇️"} ${comparisonValue.percent.toFixed(1)}% vs mes previo.`
        : "- Tendencia reciente: sin datos suficientes.",
      metaGap >= 0
        ? `- Cumplimiento de meta: ✅ superado por ${chartValueFormatter(Math.abs(metaGap))}.`
        : `- Cumplimiento de meta: ⚠️ pendiente por ${chartValueFormatter(Math.abs(metaGap))}.`,
      focusCondition === "all"
        ? `- Inventario disponible: ${focusInventoryUnits} unidades (total).`
        : `- Inventario enfocado (${focusCondition}): ${focusInventoryUnits} unidades sobre ${totalInventoryUnits}.`,
    ];

    if (statsInventory) {
      const val = Number(statsInventory.value) || 0;
      const avg = Number(statsInventory.average_price) || 0;
      insightsLines.push(
        `- Valor total en inventario: $${Math.round(val).toLocaleString()} (precio promedio $${Math.round(avg).toLocaleString()}).`
      );
    }

    if (statsSales?.top_models?.length > 0) {
      const mejorModelo = statsSales.top_models[0];
      if (mejorModelo) {
        const ingresos = Number(mejorModelo.ingresos) || 0;
        insightsLines.push(
          `- Modelo estrella: ${mejorModelo.modelo || 'Desconocido'} con ${mejorModelo.cantidad || 0} ventas por $${Math.round(ingresos).toLocaleString()}.`
        );
      }
    }

    return [
      title,
      "\n## Métricas claves",
      statsLines.join("\n"),
      "\n## Tendencia mensual",
      tableHeader,
      tableRows,
      "\n## Distribución de inventario",
      inventoryLines.join("\n"),
      "\n## Hallazgos",
      insightsLines.join("\n"),
      "\n> Exporta este Markdown y conviértelo a PDF con tu herramienta favorita (VSCode, Obsidian, Typora, etc.).",
    ].join("\n");
  }, [
    includeMarkdownSummary,
    metricLabel,
    timeRange,
    salesTotal,
    revenueTotal,
    averageTicket,
    conversionRate,
    chartData,
    includeGoalBenchmark,
    chartValueFormatter,
    inventoryData,
    totalInventoryUnits,
    comparisonValue,
    metaGap,
    focusCondition,
    focusInventoryUnits,
    statsInventory,
    statsSales,
  ]);

  const handleExportMarkdown = () => {
    if (!markdownReport) return;

    const blob = new Blob([markdownReport], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_${selectedMetric}_${timeRange}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderReferenceLine = () =>
    comparePrevious ? (
      <ReferenceLine
        y={averageValue}
        stroke="#8B5CF6"
        strokeDasharray="4 4"
        label={{
          value: `Promedio ${averageDisplay}`,
          position: "insideTop",
          fill: isDarkMode ? "#E5E7EB" : "#1F2937",
          fontSize: 12,
        }}
      />
    ) : null;

  const tooltipStyle = {
    backgroundColor: isDarkMode ? "#1F1F1F" : "#FFFFFF",
    border: `1px solid ${isDarkMode ? "#3F3F46" : "#E5E7EB"}`,
    borderRadius: "8px",
  };

  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-600 text-sm text-gray-500">
          No hay datos suficientes para este rango de fechas.
        </div>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2E2E2E" : "#E5E7EB"} />
            <XAxis dataKey="mes" stroke={isDarkMode ? "#9CA3AF" : "#4B5563"} />
            <YAxis stroke={isDarkMode ? "#9CA3AF" : "#4B5563"} />
            <Tooltip
              formatter={(value: number) => chartValueFormatter(value)}
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDarkMode ? "#F3F4F6" : "#1F2937" }}
            />
            <Legend wrapperStyle={{ color: isDarkMode ? "#E5E7EB" : "#374151" }} />
            <Line type="monotone" dataKey="value" name={metricLabel} stroke="#3A86FF" strokeWidth={3} dot={{ r: 4 }} />
            {includeGoalBenchmark && (
              <Line type="monotone" dataKey="meta" name="Meta" stroke="#FFB800" strokeWidth={2} strokeDasharray="6 4" />
            )}
            {renderReferenceLine()}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3A86FF" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#3A86FF" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2E2E2E" : "#E5E7EB"} />
            <XAxis dataKey="mes" stroke={isDarkMode ? "#9CA3AF" : "#4B5563"} />
            <YAxis stroke={isDarkMode ? "#9CA3AF" : "#4B5563"} />
            <Tooltip
              formatter={(value: number) => chartValueFormatter(value)}
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDarkMode ? "#F3F4F6" : "#1F2937" }}
            />
            <Legend wrapperStyle={{ color: isDarkMode ? "#E5E7EB" : "#374151" }} />
            <Area type="monotone" dataKey="value" name={metricLabel} stroke="#3A86FF" fill="url(#valueGradient)" strokeWidth={2} />
            {includeGoalBenchmark && (
              <Line type="monotone" dataKey="meta" name="Meta" stroke="#FFB800" strokeWidth={2} strokeDasharray="6 4" />
            )}
            {renderReferenceLine()}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2E2E2E" : "#E5E7EB"} />
          <XAxis dataKey="mes" stroke={isDarkMode ? "#9CA3AF" : "#4B5563"} />
          <YAxis stroke={isDarkMode ? "#9CA3AF" : "#4B5563"} />
          <Tooltip
            formatter={(value: number) => chartValueFormatter(value)}
            contentStyle={tooltipStyle}
            labelStyle={{ color: isDarkMode ? "#F3F4F6" : "#1F2937" }}
          />
          <Legend wrapperStyle={{ color: isDarkMode ? "#E5E7EB" : "#374151" }} />
          <Bar dataKey="value" name={metricLabel} fill="#3A86FF" radius={[8, 8, 0, 0]} />
          {includeGoalBenchmark && (
            <Line type="monotone" dataKey="meta" name="Meta" stroke="#FFB800" strokeWidth={2} strokeDasharray="6 4" />
          )}
          {renderReferenceLine()}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const priceSegments = useMemo(() => {
    if (!statsInventory) return [];
    return (statsInventory.price_segments || []).filter((segment) => segment && segment.count > 0);
  }, [statsInventory]);

  const capacityEntries = useMemo(() => {
    if (!statsInventory) return [];
    return Object.entries(statsInventory.capacity_distribution || {});
  }, [statsInventory]);

  const fallbackTopSales = [
    { modelo: "iPhone 15 Pro Max", cantidad: 5, ingresos: 289_999 },
    { modelo: "iPhone 15 Pro", cantidad: 4, ingresos: 219_999 },
    { modelo: "iPhone 14 Pro", cantidad: 3, ingresos: 179_999 },
  ];

  const topSellingModels = statsSales?.top_models?.length > 0 ? statsSales.top_models : fallbackTopSales;
  const totalTopSales = topSellingModels.reduce((sum, item) => sum + item.cantidad, 0);

  const kpiCards = [
    {
      label: "Ventas completadas",
      value: salesTotal.toString(),
      helper: "Pedidos despachados en el periodo",
      icon: ShoppingCart,
      color: "bg-emerald-500",
    },
    {
      label: "Ingresos acumulados",
      value: `$${Math.round(revenueTotal).toLocaleString()}`,
      helper: "Total recaudado a la fecha",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      label: "Ticket promedio",
      value: `$${Math.round(averageTicket).toLocaleString()}`,
      helper: "Ingreso por cada venta",
      icon: TrendingUp,
      color: "bg-violet-500",
    },
    {
      label: "Conversión vs inventario",
      value: `${conversionRate}%`,
      helper: "Relación ventas / capacidad",
      icon: Package,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className={`mb-2 text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Reportes Avanzados
        </h1>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Personaliza las métricas, genera comparativos y exporta la información clave del tablero.
        </p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg border p-6 ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className={`mb-1 text-2xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{stat.label}</div>
              <div className={`mt-2 text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>{stat.helper}</div>
            </div>
          );
        })}
      </div>

      <div
        className={`mb-8 rounded-lg border p-6 ${
          isDarkMode ? "bg-[#1F1F1F] border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className={`mb-1 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <Settings className="h-5 w-5" />
              <span className="font-semibold">Personalización de reportes</span>
            </div>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Ajusta el periodo, la métrica y el tipo de visualización. Exporta los datos con un clic.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={handleExportCsv} className="whitespace-nowrap">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Button onClick={handleExportMarkdown} className="whitespace-nowrap">
              <FileText className="h-4 w-4" />
              Exportar Markdown
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <span className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Métrica
            </span>
            <Select
              value={selectedMetric}
              onValueChange={(value) => setSelectedMetric(value as MetricOption)}
            >
              <SelectTrigger className={`mt-2 w-full ${isDarkMode ? "bg-[#1C1C1C] border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                <SelectValue placeholder="Selecciona una métrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ventas">Ventas (unidades)</SelectItem>
                <SelectItem value="ingresos">Ingresos ($ MXN)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Periodo
            </span>
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as TimeRangeOption)}
            >
              <SelectTrigger className={`mt-2 w-full ${isDarkMode ? "bg-[#1C1C1C] border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                <SelectValue placeholder="Selecciona un periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="12m">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Tipo de gráfico
            </span>
            <Select
              value={chartType}
              onValueChange={(value) => setChartType(value as ChartTypeOption)}
            >
              <SelectTrigger className={`mt-2 w-full ${isDarkMode ? "bg-[#1C1C1C] border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Barras comparativas</SelectItem>
                <SelectItem value="line">Tendencia (línea)</SelectItem>
                <SelectItem value="area">Área acumulada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Foco de inventario
            </span>
            <Select
              value={focusCondition}
              onValueChange={(value) => setFocusCondition(value as ConditionOption)}
            >
              <SelectTrigger className={`mt-2 w-full ${isDarkMode ? "bg-[#1C1C1C] border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el inventario</SelectItem>
                <SelectItem value="nuevo">Solo Nuevos</SelectItem>
                <SelectItem value="seminuevo">Solo Seminuevos</SelectItem>
                <SelectItem value="reacondicionado">Solo Reacondicionados</SelectItem>
                <SelectItem value="otro">Otros estados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={`mt-6 flex flex-wrap items-center gap-6 border-t pt-4 ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
          <label className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <Switch checked={includeGoalBenchmark} onCheckedChange={setIncludeGoalBenchmark} />
            Mostrar meta mensual
          </label>
          <label className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <Switch checked={comparePrevious} onCheckedChange={setComparePrevious} />
            Comparar con el periodo anterior
          </label>
          <label className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <Switch checked={showPercentages} onCheckedChange={setShowPercentages} />
            Mostrar porcentajes en inventario
          </label>
          <label className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <Switch checked={includeMarkdownSummary} onCheckedChange={setIncludeMarkdownSummary} />
            Generar resumen Markdown
          </label>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className={`xl:col-span-2 rounded-lg border p-6 ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {metricLabel} por mes
              </h3>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Última actualización: {lastPoint ? lastPoint.mes : "--"}
              </p>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-medium ${isDarkMode ? "bg-[#1C1C1C] text-gray-300" : "bg-gray-100 text-gray-600"}`}>
              Rango seleccionado: {timeRange === "3m" ? "3 meses" : timeRange === "6m" ? "6 meses" : "12 meses"}
            </div>
          </div>
          {renderChart()}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Promedio del periodo
              </p>
              <p className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{averageDisplay}</p>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Último mes registrado
              </p>
              <p className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {lastPoint ? `${chartValueFormatter(lastPoint.value)} (${lastPoint.mes})` : "Sin datos"}
              </p>
              {comparisonValue && (
                <span className={`text-xs ${comparisonValue.diff >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {comparisonValue.diff >= 0 ? "+" : "-"}
                  {comparisonValue.diff >= 0 ? chartValueFormatter(comparisonValue.diff) : chartValueFormatter(Math.abs(comparisonValue.diff))}
                  {" "}({comparisonValue.diff >= 0 ? "+" : ""}{comparisonValue.percent.toFixed(1)}%) vs periodo anterior
                </span>
              )}
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Desviación vs meta
              </p>
              <p className={`text-base font-semibold ${metaGap >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {metaGap >= 0 ? "+" : "-"}
                {chartValueFormatter(Math.abs(metaGap))}
              </p>
              <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {lastPoint ? `Meta mensual: ${chartValueFormatter(lastPoint.meta)}` : "Sin meta registrada"}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-lg border p-6 ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Distribución de inventario
            </h3>
            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{inventorySummary}</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            {pieChartData.length > 0 ? (
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={entry.opacity} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${Math.round(value)} unidades`}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: isDarkMode ? "#F3F4F6" : "#1F2937" }}
                />
              </PieChart>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Sin datos de inventario
              </div>
            )}
          </ResponsiveContainer>
          <div className="mt-4 space-y-3">
            {inventoryData.map((slice) => {
              const percent = totalInventoryUnits === 0 ? 0 : Math.round((slice.value / totalInventoryUnits) * 100);
              const isFocused = focusCondition === "all" || focusCondition === slice.key;
              return (
                <div key={slice.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: slice.color, opacity: isFocused ? 1 : 0.4 }}
                    />
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{slice.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${isFocused ? (isDarkMode ? "text-white" : "text-gray-900") : "text-gray-500"}`}>
                    {showPercentages ? `${percent}%` : `${slice.value} unidades`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {statsInventory && (
        <div className={`mt-6 rounded-lg border p-6 ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Estadísticas de inventario
              </h3>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Datos agregados en tiempo real desde el backend de Flask.
              </p>
            </div>
            <Badge variant="outline" className={isDarkMode ? "border-gray-600 text-gray-300" : undefined}>
              Datos en vivo
            </Badge>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Valor total del inventario
              </p>
              <p className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                ${Math.round(Number(statsInventory.value) || 0).toLocaleString()}
              </p>
              <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Precio promedio ${Math.round(Number(statsInventory.average_price) || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Precio mínimo registrado
              </p>
              <p className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                ${Math.round(Number(statsInventory.min_price) || 0).toLocaleString()}
              </p>
              <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Máximo ${Math.round(Number(statsInventory.max_price) || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Modelos destacados (stock)
              </p>
              <ul className="mt-1 space-y-1 text-xs">
                {(statsInventory.top_models || []).slice(0, 3).map((item, index) => {
                  if (!item) return null;
                  return (
                    <li key={item.modelo || index} className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      • {item.modelo}: {item.cantidad} unidades
                    </li>
                  );
                })}
                {(!statsInventory.top_models || statsInventory.top_models.length === 0) && (
                  <li className={isDarkMode ? "text-gray-500" : "text-gray-500"}>Sin datos suficientes</li>
                )}
              </ul>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Disponibles
              </p>
              <p className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {statsInventory.available} unidades
              </p>
              <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Inventario total: {statsInventory.total}
              </span>
            </div>
          </div>

          {priceSegments.length > 0 && (
            <div className="mt-4">
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Segmentos de precio
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {priceSegments.map((segment) => (
                  <Badge key={segment.label} className="bg-[#3A86FF]/10 text-[#3A86FF]">
                    {segment.label}: {segment.count} u.
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {capacityEntries.length > 0 && (
            <div className="mt-4">
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Distribución por capacidad
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {capacityEntries.map(([capacity, count]) => {
                  const total = Number(count);
                  const percent = totalInventoryUnits === 0 ? 0 : Math.round((total / totalInventoryUnits) * 100);
                  return (
                    <div
                      key={capacity}
                      className={`rounded-lg border p-3 text-xs ${isDarkMode ? "border-gray-700 bg-[#1F1F1F] text-gray-300" : "border-gray-200 bg-gray-50 text-gray-700"}`}
                    >
                      <p className="font-semibold">{capacity}</p>
                      <p>{total} unidades</p>
                      <span className="text-[10px] text-gray-500">{percent}% del inventario</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`mt-6 rounded-lg border p-6 ${isDarkMode ? "bg-[#282828] border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="space-y-3">
          {topSellingModels.map((item, index) => {
            if (!item) return null;
            const percent = totalTopSales === 0 ? 0 : Math.round((item.cantidad / totalTopSales) * 100);
            return (
              <div
                key={item.modelo || index}
                className={`flex items-center gap-4 rounded-lg border ${
                  isDarkMode ? "border-gray-700 bg-[#1F1F1F]" : "border-gray-200 bg-gray-50"
                } p-4`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3A86FF] text-white text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{item.modelo}</span>
                    <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {item.cantidad} ventas · ${Math.round(Number(item.ingresos) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className={`h-2 w-full rounded-full ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"}`}>
                    <div className="h-2 rounded-full bg-[#3A86FF]" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {includeMarkdownSummary && (
        <div className={`mt-6 rounded-lg border p-6 ${isDarkMode ? "bg-[#1F1F1F] border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Vista previa Markdown
              </h3>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Este contenido usa formato Markdown estándar listo para exportar a PDF.
              </p>
            </div>
            <Badge variant="outline" className={isDarkMode ? "border-gray-600 text-gray-300" : undefined}>
              PDF-ready
            </Badge>
          </div>
          <pre
            className={`max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border px-4 py-3 text-xs font-mono ${
              isDarkMode ? "border-gray-700 bg-[#101010] text-gray-200" : "border-gray-200 bg-gray-50 text-gray-800"
            }`}
          >
            {markdownReport}
          </pre>
          <p className={`mt-3 text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
            Consejo: Abre el archivo .md en VSCode y usa la vista "Export PDF" para generar el documento final con tipografía Markdown.
          </p>
        </div>
      )}
    </div>
  );
}
