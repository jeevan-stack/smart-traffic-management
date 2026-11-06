import React from 'react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm" role="alert">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div className="flex items-start gap-3">
          <span className="text-xl" aria-hidden="true">⚠️</span>
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Backend Connection Notice
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              {message}
            </p>
            <p className="text-xs text-amber-700 mt-2 font-mono bg-amber-100/70 p-2 rounded">
              Tip: Start the backend by running: <br/>
              <code className="text-amber-900 font-bold">backend\.venv\Scripts\uvicorn.exe backend.app.main:app --reload --port 8000</code>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};
