import { useNavigate, useParams } from 'react-router-dom'

const exampleTeams = {
  1: {
    id: 1,
    name: 'Germany',
    group: 'A',
    managerFullName: 'Julian Nagelsmann',
    players: [
      { id: 1, number: 1, fullName: 'Manuel Neuer', position: 'GK' },
      { id: 2, number: 2, fullName: 'Antonio Rüdiger', position: 'DF' },
      { id: 3, number: 3, fullName: 'David Raum', position: 'DF' },
      { id: 4, number: 4, fullName: 'Jonathan Tah', position: 'DF' },
      { id: 5, number: 5, fullName: 'Pascal Groß', position: 'MF' },
      { id: 6, number: 6, fullName: 'Joshua Kimmich', position: 'DF' },
    ],
  },
}

function getTeam(teamId) {
  if (teamId && exampleTeams[teamId]) {
    return exampleTeams[teamId]
  }
  return exampleTeams[1]
}

function TeamDetails() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const numericId = Number(teamId)
  const team = getTeam(Number.isNaN(numericId) ? undefined : numericId)

  return (
    <section>
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <h2>{team.name}</h2>
      <p>
        Group {team.group} · Manager: {team.managerFullName}
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {team.players.map((player) => (
            <tr key={player.id}>
              <td>{player.number}</td>
              <td>{player.fullName}</td>
              <td>{player.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default TeamDetails
