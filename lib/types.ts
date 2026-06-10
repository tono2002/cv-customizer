import { z } from "zod";

export type ProgressEvent = { type: 'progress'; step: number; message: string };
export type DoneEvent = { type: 'done'; pdf: string }; // base64
export type ErrorEvent = { type: 'error'; error: string; details?: string };
export type StreamEvent = ProgressEvent | DoneEvent | ErrorEvent;

export const GenerateRequestSchema = z.object({
  cvBase64: z.string().min(1, "CV PDF is required"),
  cvMediaType: z.literal("application/pdf"),
  linkedinBase64: z.string().optional(),
  linkedinMediaType: z.literal("application/pdf").optional(),
  jobOffer: z.string().min(10, "Job offer must be at least 10 characters"),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

export interface GenerateSuccessResponse {
  ok: true;
}

export interface GenerateErrorResponse {
  ok: false;
  error: string;
  details?: string;
}

export type GenerateResponse = GenerateSuccessResponse | GenerateErrorResponse;

export interface UploadedFile {
  name: string;
  base64: string;
  mediaType: "application/pdf";
  sizeBytes: number;
}
