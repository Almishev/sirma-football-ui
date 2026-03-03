const API_BASE = 'http://localhost:8091/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
    },
    ...options,
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

export function fetchMatches() {
  return request('/matches')
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

