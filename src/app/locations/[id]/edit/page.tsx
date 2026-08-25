import { AppLayout } from "@/components/layout/AppLayout";
import { LocationForm } from "@/components/locations/LocationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const locationData = {
  name: "Estantería A - Nivel superior",
  code: "A1",
  type: "Estantería",
  description:
    "Ubicación para muestras sólidas y materiales estables a temperatura ambiente.",
  maxVolume: "20000",
  maxArea: "5000",
  maxWeight: "15000",
  allowedTypes: ["Resina", "Polímero"],
};

export default function EditStorageUnitPage() {
    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl space-y-8">
                <div>
                    <Link
                        href="/locations/estanteria-a"
                        className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-accent"
                    >
                        <ArrowLeft size={18} />
                        Volver al detalle
                    </Link>

                    <h1 className="mt-4 text-4xl font-black text-primary">
                        Editar unidad de almacenamiento
                    </h1>

                    <p className="mt-2 text-secondary">
                        Actualiza la información general y la capacidad de esta unidad de
                        almacenamiento.
                    </p>
                </div>

                <LocationForm
                    mode="edit"
                    initialData={locationData}
                />
            </div>
        </AppLayout>
    );
}