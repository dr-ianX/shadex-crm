import { authService } from './services/authService'

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await authService.fetchWithAuth(input, init)
  if (response.status === 401) {
    authService.logout()
    window.location.href = '/#/login'
  }
  return response
}
