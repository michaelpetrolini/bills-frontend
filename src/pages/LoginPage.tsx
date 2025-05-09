import { GoogleLogin } from '@react-oauth/google';
import axiosClient from '../api/axiosClient';
import { useState } from 'react';

export default function LoginPage() {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<any | null>(null);

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const response = await axiosClient.post('/auth/google', { idToken });
      const { token } = response.data;
      setJwtToken(token);
      localStorage.setItem('jwtToken', token);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Login failed.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        throw new Error('User is not authenticated.');
      }

      const response = await axiosClient.post('/analyze', formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalyzeResult(response.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'File upload failed.');
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
      <div className="mt-6">
        <label className="block mb-2 font-bold">Upload a file:</label>
        <input
          type="file"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>
      {analyzeResult && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded">
          <h2 className="font-bold">Analysis Result:</h2>
          <pre className="text-sm">{JSON.stringify(analyzeResult, null, 2)}</pre>
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
