import http from "http";
import { TokenBucketRateLimiter } from "./limiter/token_bucket";
import { JWTValidator } from "./auth/jwt_validator";
import { RBACPolicyEngine } from "./auth/rbac_engine";

const PORT = 8080;
const limiter = new TokenBucketRateLimiter(50, 5);
const validator = new JWTValidator();
const rbac = new RBACPolicyEngine();

const server = http.createServer((req, res) => {
  const clientIp = req.socket.remoteAddress || "unknown";

  // 1. Rate Limiting
  if (!limiter.allowRequest(clientIp)) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Too Many Requests - Rate Limit Exceeded" }));
    return;
  }

  // 2. Health endpoint
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }));
    return;
  }

  // 3. Authentication & Authorization
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized: Missing or malformed Bearer token" }));
    return;
  }

  const token = authHeader.substring(7);
  const claims = validator.verifyToken(token);
  if (!claims) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Forbidden: Invalid or expired token" }));
    return;
  }

  // Forwarding context
  res.writeHead(200, {
    "Content-Type": "application/json",
    "X-Forwarded-User": claims.sub,
    "X-ZeroTrust-Verified": "true"
  });
  res.end(JSON.stringify({
    message: "Access granted by Zero-Trust Gatekeeper",
    user: claims.sub,
    role: claims.role
  }));
});

server.listen(PORT, () => {
  console.log(`🛡️ Zero-Trust Gatekeeper listening on port ${PORT}`);
});
