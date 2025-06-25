# 🛡️ Zero-Trust Gatekeeper

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

A high-performance Zero-Trust API gateway microservice with cryptographic JWT verification, token bucket rate limiting, and RBAC policy evaluation.

---

## 🏛️ Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    Client ->> Gatekeeper: HTTP Request with Bearer JWT
    Gatekeeper ->> Gatekeeper: Token Bucket Rate Limiter Check
    alt Rate Limit Exceeded
        Gatekeeper -->> Client: 429 Too Many Requests
    end
    Gatekeeper ->> Gatekeeper: Verify RS256 Signature & Claims
    alt Invalid Token
        Gatekeeper -->> Client: 401 Unauthorized
    end
    Gatekeeper ->> Gatekeeper: RBAC Policy Engine Check
    Gatekeeper ->> Upstream Microservices: Forward with X-ZeroTrust-Verified & Auth Headers
```

## 🚀 Features

- **Asymmetric JWT Verification**: Stateless verification with role decoding.
- **Token Bucket Rate Limiting**: Defends microservices against DDoS and volumetric bursts.
- **RBAC Policy Matrix**: Granular action-level authorization (Admin, Developer, Viewer).
- **Audit-Ready Headers**: Appends client identity and sanitizes inbound metadata.

## 🛠️ Usage

```bash
npm install
npm run build
npm start
```

## 📜 License
MIT License. Built by [Shashank Shrivastva](https://github.com/shashankshrivastva-hue).
