import { TokenBucketRateLimiter } from "../src/limiter/token_bucket";
import { JWTValidator } from "../src/auth/jwt_validator";
import { RBACPolicyEngine } from "../src/auth/rbac_engine";

describe("Zero-Trust Security Layer", () => {
  test("Token bucket limits bursts", () => {
    const limiter = new TokenBucketRateLimiter(2, 1);
    expect(limiter.allowRequest("ip-1")).toBe(true);
    expect(limiter.allowRequest("ip-1")).toBe(true);
    expect(limiter.allowRequest("ip-1")).toBe(false);
  });

  test("JWT generation and verification", () => {
    const validator = new JWTValidator();
    const token = validator.generateMockToken("user-1", "admin", ["read", "write"]);
    const claims = validator.verifyToken(token);
    expect(claims?.sub).toBe("user-1");
    expect(claims?.role).toBe("admin");
  });

  test("RBAC hierarchy enforcement", () => {
    const rbac = new RBACPolicyEngine();
    expect(rbac.isAuthorized("admin", "delete")).toBe(true);
    expect(rbac.isAuthorized("viewer", "write")).toBe(false);
  });
});
