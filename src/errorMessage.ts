export function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return 'Something went wrong.';
}
