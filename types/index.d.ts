import type { ErrorCode } from "~/types/enums/errors";

declare global {
  type ErrorCode = typeof ErrorCode;
}

export {};
