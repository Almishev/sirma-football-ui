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

/**
 * Upload a CSV file to an import endpoint. Uses multipart/form-data with field name "file".
 * @param {'teams'|'players'|'matches'|'records'} type - which import endpoint to call
 * @param {File} file - the CSV file
 * @returns {Promise<{ imported: number }>}
 */
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

/**
 * Delete existing data from the database (for admin: clear before re-import).
 * @param {'records'|'matches'|'players'|'teams'} type
 * @returns {Promise<{ deleted: number }>}
 */
export function deleteImportData(type) {
  return request(`/import/${type}`, { method: 'DELETE' })
}

/**
 * Delete all data in dependency order: records, matches, players, teams.
 * @returns {Promise<{ records: number, matches: number, players: number, teams: number }>}
 */
export function deleteAllImportData() {
  return request('/import/all', { method: 'DELETE' })
}

