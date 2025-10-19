import React, { useState, useRef } from 'react';
import type { Menu } from '../types';
import { PlusIcon } from './icons';
import MenuDialog from './MenuDialog';

interface MenuPageProps {
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>; // Keep for consistency, though unused in this version
  onSelectMenu: (menu: Menu) => void;
  onAddMenu: (menu: Menu) => void;
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (menuId: string) => void;
  onClose: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const MenuItem: React.FC<{menu: Menu, onSelect: (menu: Menu) => void, onEdit: (menu: Menu) => void}> = ({ menu, onSelect, onEdit }) => {
    
    const pressTimer = useRef<number | null>(null);
    const wasLongPress = useRef<boolean>(false);

    const handlePressStart = () => {
        wasLongPress.current = false;
        pressTimer.current = window.setTimeout(() => {
            wasLongPress.current = true;
            onEdit(menu);
        }, 800); // 800ms for a long press
    };

    const handlePressEnd = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };
    
    const handleClick = () => {
        if (!wasLongPress.current) {
            onSelect(menu);
        }
    };
    
    return (
        <div
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center touch-none cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
            onClick={handleClick}
            onContextMenu={(e) => { e.preventDefault(); onEdit(menu); }}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
        >
            <span className="text-lg font-semibold text-gray-800 flex-grow">{menu.menuName}</span>
            <span className="text-lg font-bold text-gray-900 tabular-nums">{formatTime(menu.cookTime)}</span>
        </div>
    );
};

const MenuPage: React.FC<MenuPageProps> = ({ menus, onSelectMenu, onAddMenu, onEditMenu, onDeleteMenu, onClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const handleOpenAddDialog = () => {
    setEditingMenu(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (menu: Menu) => {
    setEditingMenu(menu);
    setIsDialogOpen(true);
  };

  const handleSaveMenu = (menu: Menu) => {
    if (editingMenu) {
      onEditMenu(menu);
    } else {
      onAddMenu(menu);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-20 flex justify-center">
      <div className="w-full max-w-md h-full flex flex-col bg-black relative">
        <header className="bg-gray-900/80 backdrop-blur-sm text-white p-4 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">MENU</h1>
          <button
            onClick={onClose}
            className="text-lg font-semibold text-blue-400 hover:text-blue-300"
          >
            Back
          </button>
        </header>
        <main className="flex-grow overflow-y-auto p-2">
          {menus.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg">No menus available.</p>
              <p>Click the '+' button to add your first menu!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {menus.map((menu) => (
                <MenuItem 
                  key={menu.id} 
                  menu={menu}
                  onSelect={onSelectMenu}
                  onEdit={handleOpenEditDialog}
                />
              ))}
            </div>
          )}
        </main>
        
        <button
          onClick={handleOpenAddDialog}
          className="absolute bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
        >
          <PlusIcon className="w-8 h-8" />
        </button>

        <MenuDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveMenu}
          onDelete={onDeleteMenu}
          existingMenu={editingMenu}
        />
      </div>
    </div>
  );
};

export default MenuPage;