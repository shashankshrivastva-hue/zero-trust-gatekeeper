/** Token Bucket Rate Limiter */
export class TokenBucketRateLimiter {
  private capacity: number;
  private refillRate: number; // tokens per second
  private buckets: Map<string, { tokens: number; lastRefill: number }>;

  constructor(capacity: number = 60, refillRate: number = 10) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.buckets = new Map();
  }

  public allowRequest(clientId: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(clientId);

    if (!bucket) {
      bucket = { tokens: this.capacity - 1, lastRefill: now };
      this.buckets.set(clientId, bucket);
      return true;
    }

    const elapsedSeconds = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(this.capacity, bucket.tokens + elapsedSeconds * this.refillRate);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    return false;
  }
}
