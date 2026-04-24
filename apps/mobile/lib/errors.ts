/** Best-effort user-facing message from tRPC / fetch errors. */
export function errorMessageFromUnknown(err: unknown): string | null {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message ?? '');
  }
  return null;
}
