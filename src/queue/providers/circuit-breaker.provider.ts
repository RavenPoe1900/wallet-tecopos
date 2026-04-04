import {
  retry,
  handleAll,
  ExponentialBackoff,
  circuitBreaker,
  ConsecutiveBreaker,
  wrap,
} from 'cockatiel';
import { COCKATIEL_CONFIG } from '../config/env.config';

/**
 * NestJS provider that configures and exposes a combined resilience policy.
 * Implements the Circuit Breaker and Retry patterns using the Cockatiel library.
 */
export const CircuitBreakerProvider = {
  provide: 'COCKATIEL_POLICY',
  useFactory: () => {
    // Load configuration from environment variables with safe defaults
    const halfOpenAfter = COCKATIEL_CONFIG.HALF_OPEN_AFTER_MS;
    const consecutiveFailures = COCKATIEL_CONFIG.CONSECUTIVE_FAILURES;
    const maxAttempts = COCKATIEL_CONFIG.MAX_ATTEMPTS;
    const initialDelay = COCKATIEL_CONFIG.BACKOFF_INITIAL_DELAY_MS;
    const maxDelay = COCKATIEL_CONFIG.BACKOFF_MAX_DELAY_MS;

    // Circuit Breaker: Opens after `consecutiveFailures` consecutive errors.
    // Once open, it waits `halfOpenAfter` ms before allowing a test request.
    const breaker = circuitBreaker(handleAll, {
      halfOpenAfter,
      breaker: new ConsecutiveBreaker(consecutiveFailures),
    });

    // Retry Policy: Retries up to `maxAttempts` times on failure.
    // Uses exponential backoff to gradually increase wait times between retries,
    // preventing the "thundering herd" effect on the downstream service.
    const retryPolicy = retry(handleAll, {
      maxAttempts,
      backoff: new ExponentialBackoff({ initialDelay, maxDelay }),
    });

    // Combine policies: Retry is the inner policy, Circuit Breaker is the outer.
    // This ensures local retries happen first. Only after all retries fail
    // does the circuit breaker count the attempt and potentially open.
    return wrap(retryPolicy, breaker);
  },
};
