import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <LoginPage />
    </GoogleOAuthProvider>
  );
}

export default App;
