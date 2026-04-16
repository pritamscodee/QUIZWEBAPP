import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Test backend connection
    axios.get('/api/health')
      .then(response => {
        setMessage(response.data.message);
        toast.success('Connected to backend!');
      })
      .catch(error => {
        setMessage('Backend not connected');
        toast.error('Failed to connect to backend');
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            🎯 Quiz Web Application
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Built with React + Vite + Node.js + MongoDB
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              ✅ Backend Status: {message}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-800 mb-2">📋 MongoDB Connection:</h2>
            <p className="text-blue-700 text-sm">
              Open MongoDB Compass and connect to: <br/>
              <code className="bg-blue-100 px-2 py-1 rounded">mongodb://localhost:27017</code>
              <br/>
              Database: <strong>quizwebapp</strong>
            </p>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => toast.success('App is working! 🎉')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Test Toast Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
