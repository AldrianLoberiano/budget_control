import React, { useState, useEffect } from 'react';

const ApiStatusBar = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const log = { ...e.detail, id: Date.now(), timestamp: new Date().toLocaleTimeString() };
      setLogs((prev) => [log, ...prev].slice(0, 8));
    };
    window.addEventListener('api-status', handler);
    return () => window.removeEventListener('api-status', handler);
  }, []);

  if (logs.length === 0) return null;

  return (
    <div className="api-status-bar">
      <div className="api-status-label">API</div>
      <div className="api-status-logs">
        {logs.map((log) => (
          <div key={log.id} className={`api-status-entry ${log.success ? 'success' : 'error'}`}>
            <span className="api-method">{log.method}</span>
            <span className="api-url">{log.url}</span>
            <span className={`api-code ${log.success ? 'ok' : 'fail'}`}>{log.status}</span>
            <span className="api-time">{log.duration}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiStatusBar;
