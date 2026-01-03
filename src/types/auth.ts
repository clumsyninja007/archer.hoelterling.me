import type { KeycloakProfile } from 'keycloak-js'

export interface AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  isInitialized: boolean
  user: KeycloakProfile | null
  token: string | undefined
}