
import React, { useState, useEffect } from 'react';
import type { Menu } from '../types';
import { DeleteIcon, CloseIcon } from './icons';

interface MenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (menu: Menu) => void;
  onDelete?: (menuId: string) => void;
  existingMenu: Menu | null;
}

const MenuDialog: React.FC<MenuDialogProps> = ({ isOpen, onClose, onSave, onDelete, existingMenu }) => {
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingMenu) {
      setName(existingMenu.menuName);
      setMinutes(String(Math.floor(existingMenu.cookTime / 60)));
      setSeconds(String(existingMenu.cookTime % 60));
    } else {
      setName('');
      setMinutes('0');
      setSeconds('0');
    }
    setError('');
  }, [existingMenu, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
        setError('Menu name cannot be empty.');
        return;
    }
    const mins = parseInt(minutes, 10) || 0;
    const secs = parseInt(seconds, 10) || 0;
    if (mins < 0 || secs < 0 || secs > 59) {
        setError('Please enter valid minutes and seconds (0-59).');
        return;
    }

    const totalSeconds = (mins * 60) + secs;
    if (totalSeconds <= 0) {
        setError('Total cook time must be greater than zero.');
        return;
    }

    onSave({
      id: existingMenu ? existingMenu.id : new Date().toISOString(),
      menuName: name,
      cookTime: totalSeconds,
    });
    onClose();
  };

  const handleDelete = () => {
    if (existingMenu && onDelete) {
        onDelete(existingMenu.id);
        onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{existingMenu ? 'Edit Menu' : 'Add Menu'}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <CloseIcon className="w-6 h-6 text-gray-500" />
            </button>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="mb-4">
          <label htmlFor="menuName" className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
          <input
            id="menuName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., French Fries"
          />
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time</label>
            <div className="flex items-center space-x-2">
                <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    placeholder="MM"
                />
                <span className="font-bold text-xl text-gray-500">:</span>
                <input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    placeholder="SS"
                    max="59"
                />
            </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {existingMenu && onDelete && (
                <button onClick={handleDelete} className="p-2 text-red-600 rounded-full hover:bg-red-100 transition-colors">
                    <DeleteIcon className="w-7 h-7" />
                </button>
            )}
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            {existingMenu ? 'Save Changes' : 'Add Menu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDialog;
