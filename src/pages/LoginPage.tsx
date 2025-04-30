import { GoogleLogin, googleLogout } from '@react-oauth/google';
import axiosClient from '../api/axiosClient';
import { useState } from 'react';

export default function LoginPage() {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const response = await axiosClient.post('/auth/google', { idToken });
      const { token } = response.data;
      setJwtToken(token);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Login failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login with Google</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => setError('Google Login Failed')}
      />
      {jwtToken && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
          <h2 className="font-bold">Your App Token:</h2>
          <code className="break-words">{jwtToken}</code>
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
