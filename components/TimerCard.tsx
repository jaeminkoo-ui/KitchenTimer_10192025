import React from 'react';
import type { TimerState } from '../types';
import { StopIcon, CheckCircleIcon, RefreshIcon } from './icons';

interface TimerCardProps {
  timerState: TimerState;
  onSelectMenu: (timerId: number) => void;
  onStart: (timerId: number) => void; // Kept for future flexibility
  onStop: (timerId: number) => void;
  onReset: (timerId: number) => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerCard: React.FC<TimerCardProps> = ({ timerState, onSelectMenu, onStop, onReset }) => {
  const { timerId, status, selectedMenuName, selectedCookTime, remainingSeconds } = timerState;

  const renderContent = () => {
    switch (status) {
      case 'Ready':
        return (
          <button
            onClick={() => onSelectMenu(timerId)}
            className="w-full text-left rounded-lg transition-colors group"
          >
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-gray-800 group-hover:text-blue-600">Select Menu</span>
              <RefreshIcon className="w-9 h-9 text-gray-400 group-hover:text-blue-500" />
            </div>
          </button>
        );
      case 'InProgress':
         return (
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-5xl font-bold text-gray-900 tabular-nums">{formatTime(remainingSeconds)}</span>
              <span className="mt-1 font-semibold text-lg text-gray-500">{selectedMenuName}</span>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={() => onStop(timerId)} className="p-2 rounded-full hover:bg-red-200 transition-colors">
                <StopIcon className="w-9 h-9 text-red-600" />
              </button>
              <span className="mt-1 text-sm text-gray-400 tabular-nums">{formatTime(selectedCookTime)}</span>
            </div>
          </div>
        );
      case 'Done':
        return (
           <button onClick={() => onReset(timerId)} className="w-full text-left rounded-lg group">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-green-600">Take it Out</span>
                <span className="mt-1 font-semibold text-lg text-gray-500">{selectedMenuName}</span>
              </div>
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
          </button>
        );
      // 'Set' state is currently skipped due to auto-start feature
      case 'Set':
      default:
        return <div className="w-full" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Fryer {timerId}</h3>
        <span className="text-xs font-semibold text-gray-500 uppercase">
          {status === 'InProgress' ? 'Running' : status}
        </span>
      </div>
      <div className="p-4 min-h-[90px] flex items-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default TimerCard;
