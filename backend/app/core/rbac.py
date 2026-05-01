"""Role-Based Access Control definitions.

Role hierarchy (higher = more permissions):
  owner > admin > ai_agent > client_admin > client_user
"""

from typing import Literal

Role = Literal["owner", "admin", "ai_agent", "client_admin", "client_user"]

ROLE_HIERARCHY: dict[str, int] = {
    "owner": 100,
    "admin": 80,
    "ai_agent": 70,
    "client_admin": 40,
    "client_user": 10,
}

# Permissions map: action -> minimum role level required
PERMISSIONS: dict[str, int] = {
    "manage_tenants": ROLE_HIERARCHY["admin"],
    "deploy_tenant": ROLE_HIERARCHY["admin"],
    "view_all_tenants": ROLE_HIERARCHY["admin"],
    "dispatch_agent": ROLE_HIERARCHY["admin"],
    "view_agent_runs": ROLE_HIERARCHY["admin"],
    "manage_own_tenant": ROLE_HIERARCHY["client_admin"],
    "view_own_tenant": ROLE_HIERARCHY["client_user"],
}


def has_permission(user_role: str, action: str) -> bool:
    required = PERMISSIONS.get(action, ROLE_HIERARCHY["owner"])
    return ROLE_HIERARCHY.get(user_role, 0) >= required


def has_role(user_role: str, required_role: str) -> bool:
    return ROLE_HIERARCHY.get(user_role, 0) >= ROLE_HIERARCHY.get(required_role, 0)
