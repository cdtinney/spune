export default function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}
