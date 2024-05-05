import type { ErrorCode } from "~/types/enums/errors";

declare global {
  interface Toast {
    message: string;
    success: boolean;
    id?: number;
  }
  interface Rewards {
    id: string;
    transport: {
      method: string;
      callback: string;
    },
    reward: {
      id: string;
      title: string;
      description: string;
      cost: number;
      color: string;
    }
  }
  type ErrorCode = typeof ErrorCode;
}

export {};
