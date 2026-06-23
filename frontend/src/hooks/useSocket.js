import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export function useSocket() {
  const [progress, setProgress] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('test-progress', (data) => {
      setProgress(data);
    });

    socket.on('test-complete', (data) => {
      setFinalResult(data);
    });

    socket.on('test-error', (data) => {
      setError(data.error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function resetTestState() {
    setProgress(null);
    setFinalResult(null);
    setError(null);
  }

  return { progress, finalResult, error, resetTestState };
}