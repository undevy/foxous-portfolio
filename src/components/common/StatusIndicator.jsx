// src/components/common/StatusIndicator.jsx
import React from 'react';

const StatusIndicator = () => {
  const isAvailable = true; // Logic for availability status can be added later

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E3FFEE' }}>
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isAvailable && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75"></div>
            )}
          </div>
        </div>
        <div>
          <div className="font-medium text-gray-900">Status</div>
          <div className="text-sm text-gray-500">{isAvailable ? 'Available for projects' : 'Currently busy'}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;