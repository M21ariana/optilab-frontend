import { AppLayout } from "@/components/layout/AppLayout";
import { LocationForm } from "@/components/locations/LocationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewStorageUnitPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-accent"
          >
            <ArrowLeft size={18} />
            Volver a ubicaciones
          </Link>

          <h1 className="mt-4 text-4xl font-black text-primary">
            Nueva ubicación
          </h1>

          <p className="mt-2 text-secondary">
            Registra una nueva ubicación de almacenamiento y define su capacidad, tipo y muestras permitidas.
          </p>
        </div>

        <LocationForm mode="create" />
      </div>
    </AppLayout>
  );
}