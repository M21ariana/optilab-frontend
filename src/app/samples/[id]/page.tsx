import { AppLayout } from "@/components/layout/AppLayout";
import { SampleWorkspace } from "@/components/samples/SampleWorkspace";
import type { SampleData } from "@/components/samples/types";
import { notFound } from "next/navigation";

const samples: Record<string, SampleData> = {
  "RES-001": {
    id: "RES-001",

    name: "Muestra Resina A",
    code: "RES-001",
    type: "Resina",

    description:
      "Muestra de resina utilizada para pruebas de comportamiento y estabilidad.",

    weight: "500",
    volume: "2400",
    area: "720",

    entryDate: "2026-07-15",
    expirationDate: "2026-09-02",

    status: "ACTIVE",

    locationId: "a1",
    locationCode: "A1",
    locationName: "Estantería A - Nivel superior",
  },

  "POL-014": {
    id: "POL-014",

    name: "Polímero Experimental B",
    code: "POL-014",
    type: "Polímero",

    description:
      "Polímero utilizado en pruebas experimentales de materiales.",

    weight: "350",
    volume: "1800",
    area: "540",

    entryDate: "2026-07-22",
    expirationDate: "",

    status: "ACTIVE",

    locationId: "a2",
    locationCode: "A2",
    locationName: "Estantería A - Nivel medio",
  },

  "CHE-220": {
    id: "CHE-220",

    name: "Solución Química C",
    code: "CHE-220",
    type: "Sustancia química",

    description:
      "Solución utilizada para análisis y pruebas químicas.",

    weight: "120",
    volume: "900",
    area: "280",

    entryDate: "2026-06-15",
    expirationDate: "2026-08-28",

    status: "ARCHIVED",

    locationId: "g1",
    locationCode: "G1",
    locationName:
      "Gabinete químico - Compartimiento superior",
  },
};

export default async function SamplePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const isNew = id.toLowerCase() === "new";

  if (isNew) {
    return (
      <AppLayout>
        <SampleWorkspace isNew />
      </AppLayout>
    );
  }

  const sample = samples[id];

  if (!sample) {
    notFound();
  }

  return (
    <AppLayout>
      <SampleWorkspace
        isNew={false}
        initialData={sample}
      />
    </AppLayout>
  );
}