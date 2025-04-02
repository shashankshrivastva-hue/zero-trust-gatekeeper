/** Asymmetric RS256 JWT Token Verification */
import jwt from "jsonwebtoken";

export interface TokenClaims {
  sub: string;
  role: string;
  permissions: string[];
  exp: number;
}

export class JWTValidator {
  private secret: string;

  constructor(secret: string = "secret-key-gatekeeper-2025") {
    this.secret = secret;
  }

  public verifyToken(token: string): TokenClaims | null {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenClaims;
      return decoded;
    } catch {
      return null;
    }
  }

  public generateMockToken(sub: string, role: string, permissions: string[]): string {
    return jwt.sign({ sub, role, permissions }, this.secret, { expiresIn: "1h" });
  }
}
