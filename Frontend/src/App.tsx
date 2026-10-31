import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import AppRoutes from "./RBAC/AppRoutes";
import SeoManager from "./components/common/SeoManager";
import CookieConsent from "./components/common/CookieConsent";

function App() {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Router>
        <SeoManager />
        <AppRoutes />
        <CookieConsent />
      </Router>
    </SnackbarProvider>
  );
}

export default App;