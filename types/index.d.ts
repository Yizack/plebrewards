import type { ErrorCode } from "~/types/enums/errors";

declare global {
  interface Toast {
    message: string;
    success: boolean;
    id?: number;
  }
  type ErrorCode = typeof ErrorCode;
}

export {};
