import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import MatchesPage from './pages/MatchesPage.jsx'
import MatchDetailsPage from './pages/MatchDetailsPage.jsx'
import TeamDetailsPage from './pages/TeamDetailsPage.jsx'
import TeamFormPage from './pages/TeamFormPage.jsx'
import PlayerDetailsPage from './pages/PlayerDetailsPage.jsx'
import PlayersPage from './pages/PlayersPage.jsx'
import PlayerFormPage from './pages/PlayerFormPage.jsx'
import MatchFormPage from './pages/MatchFormPage.jsx'
import TeamsPage from './pages/TeamsPage.jsx'
import GroupsPage from './pages/GroupsPage.jsx'
import StandingsPage from './pages/StandingsPage.jsx'
import PlayerPairsPage from './pages/PlayerPairsPage.jsx'
import ImportPage from './pages/ImportPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import AuthCallbackPage from './pages/AuthCallbackPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import AdminUsersPage from './pages/AdminUsersPage.jsx'
import DonatePage from './pages/DonatePage.jsx'
import DonateSuccessPage from './pages/DonateSuccessPage.jsx'
import DonateCancelPage from './pages/DonateCancelPage.jsx'
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import TopBanner from './components/TopBanner.jsx'
import TopStrip from './components/TopStrip.jsx'

function App() {
  const { isAuthenticated, user } = useAuth()
  const canEdit = isAuthenticated && (user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_EDITOR'))
  const isAdmin = isAuthenticated && user?.roles?.includes('ROLE_ADMIN')

  return (
    <>
      <TopStrip />
      <TopBanner />
      <header className="top-nav">
        <div className="top-nav-inner">
          <Navigation />
        </div>
      </header>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MatchesPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/new" element={canEdit ? <TeamFormPage /> : <Navigate to="/" replace />} />
            <Route path="/teams/:teamId/edit" element={<TeamFormPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/players/new" element={canEdit ? <PlayerFormPage /> : <Navigate to="/" replace />} />
            <Route path="/players/:playerId/edit" element={<PlayerFormPage />} />
            <Route path="/players/:playerId" element={<PlayerDetailsPage />} />
            <Route path="/matches/new" element={canEdit ? <MatchFormPage /> : <Navigate to="/" replace />} />
            <Route path="/matches/:matchId/edit" element={<MatchFormPage />} />
            <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/standings" element={<StandingsPage />} />
            <Route path="/stats/player-pairs" element={<PlayerPairsPage />} />
            <Route path="/import" element={isAdmin ? <ImportPage /> : <Navigate to="/" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/donate/success" element={<DonateSuccessPage />} />
            <Route path="/donate/cancel" element={<DonateCancelPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App
