export const TOKEN_REFILL_OPTIONS = [
  {
    key: 'starter',
    label: 'Starter token refill',
    tokens: 100,
    estimatedPriceUsd: 9
  },
  {
    key: 'studio',
    label: 'Studio token refill',
    tokens: 500,
    estimatedPriceUsd: 39
  },
  {
    key: 'agency',
    label: 'Agency token refill',
    tokens: 1500,
    estimatedPriceUsd: 99
  }
] as const;

export type TokenRefillKey = (typeof TOKEN_REFILL_OPTIONS)[number]['key'];

export function findTokenRefillOption(key: string) {
  return TOKEN_REFILL_OPTIONS.find(option => option.key === key);
}
