import { AppLayout } from "@/components/layout/AppLayout";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { SummaryItem } from "@/components/dashboard/SummaryItem";
import { MetricCard } from "@/components/ui/MetricCard";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  FlaskConical,
  MoveRight,
  Users,
} from "lucide-react";

const recentActivity = [
  {
    id: 1,
    title: "Muestra RES-001 registrada",
    description: "Nueva muestra ingresada al inventario.",
    time: "Hace 12 min",
    type: "sample" as const,
  },
  {
    id: 2,
    title: "Muestra POL-014 trasladada",
    description: "Movida de A1 a A2.",
    time: "Hace 38 min",
    type: "movement" as const,
  },
  {
    id: 3,
    title: "Alerta de capacidad",
    description: "La ubicación G1 alcanzó 90% de ocupación.",
    time: "Hace 1 h",
    type: "alert" as const,
  },
  {
    id: 4,
    title: "Ubicación A3 actualizada",
    description: "Se modificó la capacidad máxima.",
    time: "Hace 2 h",
    type: "location" as const,
  },
];

const summaryItems = [
  {
    label: "Laboratorios",
    value: "3",
    icon: <Boxes size={18} />,
  },
  {
    label: "Usuarios activos",
    value: "12",
    icon: <Users size={18} />,
  },
  {
    label: "Tipos de material",
    value: "18",
    icon: <FlaskConical size={18} />,
  },
  {
    label: "Alertas resueltas",
    value: "92%",
    icon: <CheckCircle2 size={18} />,
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Métricas principales */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Muestras activas"
            value="248"
            icon={<FlaskConical size={22} />}
            subtitle="+12 este mes"
          />

          <MetricCard
            title="Ubicaciones usadas"
            value="72%"
            icon={<Boxes size={22} />}
            subtitle="Capacidad ocupada"
          />

          <MetricCard
            title="Alertas pendientes"
            value="8"
            icon={<AlertTriangle size={22} />}
            subtitle="3 críticas"
            variant="warning"
          />

          <MetricCard
            title="Movimientos hoy"
            value="34"
            icon={<MoveRight size={22} />}
            subtitle="Actividad diaria"
          />
        </section>

        {/* Actividad y resumen */}
        <section className="grid grid-cols-2 gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          {/* Actividad reciente */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Actividad
                </p>

                <h2 className="mt-2 text-xl font-black text-primary">
                  Actividad reciente
                </h2>

                <p className="mt-1 text-sm text-secondary">
                  Últimos cambios registrados en el laboratorio.
                </p>
              </div>
            </div>

            <div className="mt-6 divide-y divide-border">
              {recentActivity.map((item) => (
                <ActivityItem
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  time={item.time}
                  type={item.type}
                />
              ))}
            </div>
          </div>

          {/* Resumen general */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Resumen
              </p>

              <h2 className="mt-2 flex items-center gap-3 text-xl font-black text-primary">
                <BarChart3 size={22} />
                Resumen general
              </h2>

              <p className="mt-1 text-sm text-secondary">
                Estado general del laboratorio activo.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {summaryItems.map((item) => (
                <SummaryItem
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}