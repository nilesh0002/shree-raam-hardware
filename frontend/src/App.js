import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔨 Shree Raam Hardware Store</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Debug Info:</h3>
        <p>React Version: {React.version}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}

export default App;