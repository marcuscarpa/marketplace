import { circuitBreaker, handleAll, ConsecutiveBreaker } from 'cockatiel';

export const shopifyBreaker = circuitBreaker(handleAll, {
  breaker: new ConsecutiveBreaker(3),
  halfOpenAfter: 10000,
});

export const redisBreaker = circuitBreaker(handleAll, {
  breaker: new ConsecutiveBreaker(2),
  halfOpenAfter: 5000,
});