export class ApiError extends Error {
  status: number;
  errorDetails?: unknown;

  constructor(status: number, message: string, errorDetails?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorDetails = errorDetails;
  }

  /** Flattens Zod-style field errors ([{path, message}]) into a map usable by react-hook-form's setError */
  fieldErrors(): Record<string, string> {
    const map: Record<string, string> = {};
    if (Array.isArray(this.errorDetails)) {
      for (const item of this.errorDetails as { path?: string; message?: string }[]) {
        if (item?.path && item?.message) {
          const field = item.path.replace(/^body\./, "");
          map[field] = item.message;
        }
      }
    }
    return map;
  }
}
