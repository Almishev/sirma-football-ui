const API_BASE = import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? 'http://95.216.141.216:8091/api' : 'http://localhost:8091/api')

export const BACKEND_ROOT = API_BASE.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'http://95.216.141.216:8091' : 'http://localhost:8091')

export function getGoogleLoginUrl() {
  return `${BACKEND_ROOT}/oauth2/authorization/google`
}

let authToken = null

export function setAuthToken(token) {
  authToken = token
}

export function clearAuthToken() {
  authToken = null
}

export function getAuthToken() {
  return authToken
}

async function request(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...options.headers,
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }
  let body = options.body
  if (body != null && typeof body === 'object' && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const text = await response.text()
      if (text) {
        try {
          const json = JSON.parse(text)
          if (json.message) message = json.message
          else message = text
        } catch {
          message = text
        }
      }
    } catch {
     
    }
    console.log('API request failed:', path, message)
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function requestPasswordReset(email) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  })
}

export function resetPassword(token, newPassword) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  })
}

export function register(username, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: { username, email, password },
  })
}

export function fetchUsers() {
  return request('/users')
}

export function updateUserRoles(id, roleNames) {
  return request(`/users/${id}/roles`, {
    method: 'PATCH',
    body: { roleNames },
  })
}

export function banUser(id) {
  return request(`/users/${id}/ban`, { method: 'POST' })
}

export function fetchMatches(page = 0, size = 10, sort = 'date,asc') {
  const params = new URLSearchParams({ page, size, sort })
  return request(`/matches?${params.toString()}`)
}

export function fetchMatchById(id) {
  return request(`/matches/${id}`)
}

export function fetchTeamById(id) {
  return request(`/teams/${id}`)
}

export function fetchTeams() {
  return request('/teams')
}

export function fetchGroupStandings() {
  return request('/groups/standings')
}

export function fetchPlayerPairs(limit = 100) {
  const params = new URLSearchParams({ limit: String(limit) })
  return request(`/stats/player-pairs?${params.toString()}`)
}

export function fetchPlayerById(id) {
  return request(`/players/${id}`)
}

export function fetchPlayers() {
  return request('/players')
}

export function fetchPlayersPage(page = 0, size = 15, sort = 'fullName,asc') {
  const params = new URLSearchParams({ page, size, sort })
  return request(`/players?${params.toString()}`)
}

// Teams CRUD
export function createTeam(body) {
  return request('/teams', { method: 'POST', body })
}

export function updateTeam(id, body) {
  return request(`/teams/${id}`, { method: 'PUT', body })
}

export function deleteTeam(id) {
  return request(`/teams/${id}`, { method: 'DELETE' })
}

// Players CRUD
export function createPlayer(body) {
  return request('/players', { method: 'POST', body })
}

export function updatePlayer(id, body) {
  return request(`/players/${id}`, { method: 'PUT', body })
}

export function deletePlayer(id) {
  return request(`/players/${id}`, { method: 'DELETE' })
}

// Matches CRUD
export function createMatch(body) {
  return request('/matches', { method: 'POST', body })
}

export function updateMatch(id, body) {
  return request(`/matches/${id}`, { method: 'PUT', body })
}

export function deleteMatch(id) {
  return request(`/matches/${id}`, { method: 'DELETE' })
}

export function importCsv(type, file) {
  const path = `/import/${type}`
  const formData = new FormData()
  formData.append('file', file)

  const headers = { Accept: 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      let message = `Import failed with status ${response.status}`
      return response.text().then((text) => {
        if (text) message = text
        console.log('API request failed:', path, message)
        throw new Error(message)
      })
    }
    return response.json()
  })
}


export function deleteImportData(type) {
  return request(`/import/${type}`, { method: 'DELETE' })
}

export function deleteAllImportData() {
  return request('/import/all', { method: 'DELETE' })
}

