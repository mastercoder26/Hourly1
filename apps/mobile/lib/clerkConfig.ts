export function getClerkPublishableKey(): string | undefined {
  return process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
}

export function isClerkConfigured(): boolean {
  const key = getClerkPublishableKey();
  return Boolean(key && key.length > 0 && !key.includes('PLACEHOLDER'));
}
