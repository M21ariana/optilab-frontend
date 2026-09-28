"use client";

import { useRouter } from "next/navigation";

import { LaboratoryDropdown } from "@/components/layout/LaboratoryDropdown";

import type {
  LaboratoryOption,
} from "@/lib/graphql/sampleOptions";

type DashboardLaboratoryDropdownProps = {
  laboratories: LaboratoryOption[];
  selectedLaboratoryId: number | null;
};

export function DashboardLaboratoryDropdown({
  laboratories,
  selectedLaboratoryId,
}: DashboardLaboratoryDropdownProps) {
  const router = useRouter();

  function handleChange(
    laboratoryId: number | null
  ) {
    if (laboratoryId === null) {
      router.push("/dashboard");
      return;
    }

    router.push(
      `/dashboard?laboratoryId=${laboratoryId}`
    );
  }

  return (
    <LaboratoryDropdown
      laboratories={laboratories}
      selectedLaboratoryId={
        selectedLaboratoryId
      }
      onChange={handleChange}
    />
  );
}