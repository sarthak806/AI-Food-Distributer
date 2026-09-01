# Deploy SharePlate on Render

This project deploys as one service. Render builds the React frontend and the Express server serves it, including browser routes such as `/login`.

1. Create a GitHub repository with the contents of this `SharePlateTSX` folder, then push it. Keep `Backend/.env` and `Frontend/.env` private; they are excluded by `.gitignore`.
2. In Render, choose **New +** then **Blueprint**, select the GitHub repository, and create the service. Render reads `render.yaml` automatically.
3. On the service's **Environment** page, add the secret values listed in `Backend/.env.example`, plus `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_MAPS_API_KEY` from `Frontend/.env.example`.
4. Deploy the service. `FRONTEND_URL` and `VITE_Backend_URL` are filled in automatically with the Render URL.
5. Add the Render URL to the Google OAuth client's authorized JavaScript origins and callback URLs. Restrict the browser Google Maps key to the same URL.

The deployment health check is available at `/api/donation/test`.
