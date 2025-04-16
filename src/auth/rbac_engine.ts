/** Role-Based Access Control (RBAC) Policy Engine */
export class RBACPolicyEngine {
  private roleHierarchy: Map<string, Set<string>>;

  constructor() {
    this.roleHierarchy = new Map();
    this.roleHierarchy.set("admin", new Set(["read", "write", "delete", "admin"]));
    this.roleHierarchy.set("developer", new Set(["read", "write"]));
    this.roleHierarchy.set("viewer", new Set(["read"]));
  }

  public isAuthorized(role: string, requiredPermission: string): boolean {
    const permissions = this.roleHierarchy.get(role);
    if (!permissions) return false;
    return permissions.has(requiredPermission);
  }
}
