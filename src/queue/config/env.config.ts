/**
 * Safely parses an environment variable as a positive integer.
 * Returns the parsed number or the fallback value if undefined, empty, or NaN.
 */
const getEnvNumber = (key: string, fallback: number): number => {
  const val = process.env[key]?.trim();
  const parsed = val ? Number(val) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Cockatiel resilience policy configuration.
 * All values are loaded from environment variables with safe defaults.
 */
export const COCKATIEL_CONFIG = {
  // Circuit Breaker settings
  HALF_OPEN_AFTER_MS: getEnvNumber('CIRCUIT_BREAKER_HALF_OPEN_AFTER_MS', 3000),
  CONSECUTIVE_FAILURES: getEnvNumber('CIRCUIT_BREAKER_CONSECUTIVE_FAILURES', 3),

  // Retry Policy settings
  MAX_ATTEMPTS: getEnvNumber('RETRY_MAX_ATTEMPTS', 5),
  BACKOFF_INITIAL_DELAY_MS: getEnvNumber(
    'RETRY_BACKOFF_INITIAL_DELAY_MS',
    1000,
  ),
  BACKOFF_MAX_DELAY_MS: getEnvNumber('RETRY_BACKOFF_MAX_DELAY_MS', 10000),
} as const;

export const QUEUE_CONFIG = {
  PAUSE_DURATION_MS: getEnvNumber('QUEUE_PAUSE_DURATION_MS', 60_000),
  RETRY_PRIORITY: getEnvNumber('QUEUE_RETRY_PRIORITY', 1),
  MIN_PRIORITY: getEnvNumber('QUEUE_MIN_PRIORITY', 100),
} as const;
