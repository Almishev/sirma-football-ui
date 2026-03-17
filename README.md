# Football Tournament Website (Frontend)

React/Vite single page application for browsing and managing European Championship football data.

## Main Features

- **Public pages** – matches, teams, players, groups, standings, player statistics, and player-pair statistics.
- **Authentication** – login and registration with email and password, with JWT stored in the browser.
- **Google Login** – sign in with Google and receive a JWT from the backend.
- **Forgot / Reset Password** – request a password reset link via email and set a new password through a dedicated page.
- **Role-aware navigation** – editors and admins can see create/edit buttons and CSV import options; regular users see read-only views.
- **Admin Panel** – manage users, change roles, and ban/unban accounts.

## Docker & Deployment

- The Dockerfile builds the production frontend with Vite and serves it using Nginx on port **80**.
- `deploy/docker-compose.yml` defines a `football-ui` service that depends on `football-api` on the Hetzner Linux server.
- The GitHub Actions workflow `.github/workflows/deploy.yml` builds and pushes the Docker image to Docker Hub and deploys it to Hetzner via SSH on every push to the `main` branch.

## Backend and Production URL

- **Backend (Spring Boot):** the `football-api` project in this repository.
- **Production frontend (and API):**  
  http://95.216.141.216.nip.io/