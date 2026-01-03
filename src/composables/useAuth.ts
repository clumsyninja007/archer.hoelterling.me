import { ref, computed, readonly, type Ref, type ComputedRef } from 'vue'
import Keycloak, { type KeycloakProfile } from 'keycloak-js'
import { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID, KEYCLOAK_ADMIN_ROLE } from '@/constants'

// Singleton Keycloak instance
let keycloakInstance: Keycloak | null = null

// Reactive state
const isAuthenticated = ref(false)
const isInitialized = ref(false)
const user = ref<KeycloakProfile | null>(null)

export interface UseAuth {
  isAuthenticated: Readonly<Ref<boolean>>
  isAdmin: ComputedRef<boolean>
  isInitialized: Readonly<Ref<boolean>>
  user: Readonly<Ref<KeycloakProfile | null>>
  token: ComputedRef<string | undefined>
  keycloak: Keycloak | null
  init: () => Promise<void>
  login: (redirectUri?: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  hasRole: (role: string) => boolean
}

export function useAuth(): UseAuth {
  // Initialize Keycloak instance if not already done
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: KEYCLOAK_URL,
      realm: KEYCLOAK_REALM,
      clientId: KEYCLOAK_CLIENT_ID
    })

    // Set up token refresh handler
    keycloakInstance.onTokenExpired = () => {
      console.log('Token expired, refreshing...')
      keycloakInstance?.updateToken(30).catch(() => {
        console.error('Token refresh failed, logging out')
        logout()
      })
    }
  }

  const isAdmin = computed(() => {
    if (!isAuthenticated.value || !keycloakInstance?.tokenParsed) {
      return false
    }
    return hasRole(KEYCLOAK_ADMIN_ROLE)
  })

  const token = computed(() => keycloakInstance?.token)

  async function init(): Promise<void> {
    if (isInitialized.value || !keycloakInstance) {
      return
    }

    try {
      const authenticated = await keycloakInstance.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      })

      isAuthenticated.value = authenticated

      if (authenticated) {
        await loadUserProfile()
      }

      isInitialized.value = true
    } catch (error: unknown) {
      // Mark as initialized even if there's an error
      isInitialized.value = true

      // Don't throw on expected errors
      const err = error as { error?: string }
      if (err?.error === 'login_required') {
        // This is expected when user is not logged in
        return
      }

      console.error('Keycloak initialization failed:', error)
      throw error
    }
  }

  async function loadUserProfile(): Promise<void> {
    if (!keycloakInstance) return

    try {
      const profile = await keycloakInstance.loadUserProfile()
      user.value = profile
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }

  async function login(redirectUri?: string): Promise<void> {
    if (!keycloakInstance) {
      throw new Error('Keycloak not initialized')
    }

    await keycloakInstance.login({
      redirectUri: redirectUri || window.location.origin
    })
  }

  async function logout(): Promise<void> {
    if (!keycloakInstance) {
      throw new Error('Keycloak not initialized')
    }

    isAuthenticated.value = false
    user.value = null

    await keycloakInstance.logout({
      redirectUri: window.location.origin
    })
  }

  async function refreshToken(): Promise<boolean> {
    if (!keycloakInstance) {
      return false
    }

    try {
      const refreshed = await keycloakInstance.updateToken(5)
      return refreshed
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  function hasRole(role: string): boolean {
    if (!keycloakInstance?.tokenParsed) {
      return false
    }

    const realmAccess = keycloakInstance.tokenParsed.realm_access as { roles?: string[] } | undefined
    return realmAccess?.roles?.includes(role) ?? false
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    isAdmin,
    isInitialized: readonly(isInitialized),
    user: readonly(user),
    token,
    keycloak: keycloakInstance,
    init,
    login,
    logout,
    refreshToken,
    hasRole
  }
}