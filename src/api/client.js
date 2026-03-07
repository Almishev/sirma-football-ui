const API_BASE = import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? 'http://95.216.141.216:8091/api' : 'http://localhost:8091/api')

async function request(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...options.headers,
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
        message = text
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

  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
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

