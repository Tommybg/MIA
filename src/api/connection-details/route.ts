export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// Vite-compatible client-side function to get connection details
export async function getConnectionDetails(): Promise<ConnectionDetails> {
  try {
    // Call your Python backend API server
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/connection-details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ConnectionDetails = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get connection details:', error);
    throw new Error('Failed to connect to MIA backend. Make sure the API server is running on port 5001.');
  }
}