export type Movement = {
  id: number;
  sampleId: string;
  sampleCode: string;
  sampleName: string;
  type: "ENTRY" | "TRANSFER" | "EXIT";
  typeLabel: string;
  fromLocation: string | null;
  fromLocationName: string | null;
  toLocation: string | null;
  toLocationName: string | null;
  notes: string;
  date: string;
  time: string;
};