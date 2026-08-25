import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  FlaskConical,
  Lock,
  Play,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-primary">
      {/* HEADER */}
      <header className="border-b border-border/70 bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/optilab_logo.png"
              alt="OptiLab Logo"
              width={220}
              height={65}
              priority
              className="h-auto w-[220px] object-contain"
            />
          </Link>

          <div className="hidden items-center gap-10 text-sm font-medium text-primary lg:flex">
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary"
            >
              <Lock size={16} />
              Iniciar sesión
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-20 top-20 h-72 w-72 rounded-full bg-warning/10 blur-3xl" />

        <div className="mx-auto grid min-h-[720px] max-w-7xl grid-cols-1 items-center gap-14 px-8 py-16 lg:grid-cols-[1fr_0.95fr]">
          <div className="relative z-10">
            <p className="mb-8 text-sm font-extrabold uppercase tracking-[0.38em] text-accent">
              Optimize · Organize · Innovate
            </p>

            <h1 className="max-w-3xl text-6xl font-black leading-[1.05] tracking-tight text-primary md:text-7xl">
              Gestión inteligente de inventario para laboratorios.
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-secondary">
              OptiLab ayuda a laboratorios a controlar muestras, ubicaciones,
              capacidad, alertas y trazabilidad desde una plataforma moderna y
              fácil de usar.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-xl bg-accent px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-accent/20 transition hover:-translate-y-0.5 hover:opacity-90"
              >
                <FlaskConical size={20} />
                Entrar al sistema
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-3">
              <MiniTrustItem
                icon={<ShieldCheck size={26} />}
                title="Datos seguros"
                subtitle="y confiables"
              />
              <MiniTrustItem
                icon={<TrendingUp size={26} />}
                title="Eficiencia"
                subtitle="operativa"
              />
              <MiniTrustItem
                icon={<Bell size={26} />}
                title="Alertas en"
                subtitle="tiempo real"
                accent="warning"
              />
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-8 pb-16">
        <div className="grid grid-cols-1 gap-5 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-primary/10 md:grid-cols-4">
          <FeatureStrip
            icon={<Box size={30} />}
            title="Organización total"
            text="Estructura clara para un control total del inventario."
          />
          <FeatureStrip
            icon={<BarChart3 size={30} />}
            title="Optimización de recursos"
            text="Aprovecha mejor el espacio y la capacidad disponible."
            color="blue"
          />
          <FeatureStrip
            icon={<Bell size={30} />}
            title="Alertas inteligentes"
            text="Notificaciones para tomar mejores decisiones."
            color="orange"
          />
          <FeatureStrip
            icon={<ShieldCheck size={30} />}
            title="Trazabilidad completa"
            text="Historial y movimientos para garantizar confiabilidad."
            color="purple"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/70 bg-background px-8 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/optilab_logo.png"
              alt="OptiLab Logo"
              width={180}
              height={52}
              className="h-auto w-[180px] object-contain"
            />
          </Link>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-primary">

          </div>

          <p className="text-sm text-secondary">
            © 2026 OptiLab. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

function DashboardPreview() {
  return (
    <div className="relative z-10 rounded-[2rem] border border-border bg-surface p-7 shadow-2xl shadow-primary/15">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="text-lg text-secondary">Resumen del laboratorio</p>
          <h2 className="text-3xl font-black text-primary">
            Dashboard principal
          </h2>
        </div>

        <span className="rounded-full bg-accent/10 px-5 py-2 text-base font-extrabold text-accent">
          78% utilizado
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <MetricCard
          icon={<FlaskConical />}
          value="2,543"
          label="Muestras"
          trend="↑ 12.5% vs. mes anterior"
        />
        <MetricCard
          icon={<Box />}
          value="78%"
          label="Ubicaciones usadas"
          trend="↑ 5.3% vs. mes anterior"
        />
        <MetricCard
          icon={<Bell />}
          value="12"
          label="Alertas activas"
          trend="↓ 2 vs. ayer"
          warning
        />
        <MetricCard
          icon={<Box />}
          value="28"
          label="Unidades de almacenamiento"
          trend="Total registradas"
          purple
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  value,
  label,
  trend,
  warning = false,
  purple = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  warning?: boolean;
  purple?: boolean;
}) {
  const iconClass = warning
    ? "bg-warning/15 text-warning"
    : purple
      ? "bg-secondary/10 text-secondary"
      : "bg-accent/10 text-accent";

  const trendClass = warning ? "text-danger" : "text-accent";

  return (
    <article className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
      >
        {icon}
      </div>
      <p className="text-4xl font-black text-primary">{value}</p>
      <p className="mt-2 text-base font-medium text-primary">{label}</p>
      <p className={`mt-4 text-sm font-bold ${trendClass}`}>{trend}</p>
    </article>
  );
}

function MiniTrustItem({
  icon,
  title,
  subtitle,
  accent = "accent",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent?: "accent" | "warning";
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent === "warning"
          ? "bg-warning/15 text-warning"
          : "bg-accent/10 text-accent"
          }`}
      >
        {icon}
      </div>
      <div>
        <p className="font-bold text-primary">{title}</p>
        <p className="text-sm text-primary">{subtitle}</p>
      </div>
    </div>
  );
}

function FeatureStrip({
  icon,
  title,
  text,
  color = "green",
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  color?: "green" | "blue" | "orange" | "purple";
}) {
  const colorClass =
    color === "orange"
      ? "bg-warning/15 text-warning"
      : color === "blue"
        ? "bg-secondary/15 text-secondary"
        : color === "purple"
          ? "bg-primary/10 text-primary"
          : "bg-accent/10 text-accent";

  return (
    <article className="flex gap-5 border-border md:border-r md:pr-5 last:border-r-0">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${colorClass}`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-extrabold text-primary">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-secondary">{text}</p>
      </div>
    </article>
  );
}