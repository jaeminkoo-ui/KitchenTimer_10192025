import React, { useState, useEffect, useCallback } from 'react';
import type { Menu, TimerState } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import TimerCard from './components/TimerCard';
import MenuPage from './components/MenuPage';

const initialTimerStates: TimerState[] = Array.from({ length: 6 }, (_, i) => ({
  timerId: i + 1,
  status: 'Ready',
  selectedMenuName: '',
  selectedCookTime: 0,
  remainingSeconds: 0,
}));

const initialMenus: Menu[] = [
    { id: '1', menuName: "Wings (First Cook)", cookTime: 420 },
    { id: '2', menuName: "Boneless (First Cook)", cookTime: 360 },
    { id: '3', menuName: "French Fries", cookTime: 330 },
]

const App: React.FC = () => {
  const [timerStates, setTimerStates] = useState<TimerState[]>(initialTimerStates);
  const [menuList, setMenuList] = useLocalStorage<Menu[]>('kitchenTimer-menuList', initialMenus);
  const [selectingMenuFor, setSelectingMenuFor] = useState<number | null>(null);

  const handleTick = useCallback(() => {
    setTimerStates(currentStates =>
      currentStates.map(timer => {
        if (timer.status === 'InProgress' && timer.remainingSeconds > 0) {
          const newRemaining = timer.remainingSeconds - 1;
          if (newRemaining <= 0) {
            // Play sound notification
             new Audio('https://cdn.freesound.org/previews/220/220171_4100837-lq.mp3').play().catch(e => console.error("Error playing sound:", e));
            return { ...timer, remainingSeconds: 0, status: 'Done' };
          }
          return { ...timer, remainingSeconds: newRemaining };
        }
        return timer;
      })
    );
  }, []);

  useEffect(() => {
    const intervalId = setInterval(handleTick, 1000);
    return () => clearInterval(intervalId);
  }, [handleTick]);
  
  const updateTimerState = (timerId: number, updates: Partial<TimerState>) => {
    setTimerStates(prevStates =>
      prevStates.map(timer =>
        timer.timerId === timerId ? { ...timer, ...updates } : timer
      )
    );
  };

  const handleSelectMenu = (timerId: number) => {
    setSelectingMenuFor(timerId);
  };

  const handleMenuChosen = (menu: Menu) => {
    if (selectingMenuFor !== null) {
      updateTimerState(selectingMenuFor, {
        status: 'InProgress',
        selectedMenuName: menu.menuName,
        selectedCookTime: menu.cookTime,
        remainingSeconds: menu.cookTime,
      });
    }
    setSelectingMenuFor(null);
  };

  const handleTimerStart = (timerId: number) => {
    updateTimerState(timerId, { status: 'InProgress' });
  };
  
  const handleTimerStop = (timerId: number) => {
    updateTimerState(timerId, {
      status: 'Ready',
      selectedMenuName: '',
      selectedCookTime: 0,
      remainingSeconds: 0,
    });
  };

  const handleTimerReset = (timerId: number) => {
    handleTimerStop(timerId);
  };
  
  const handleAddMenu = (menu: Menu) => {
    setMenuList([...menuList, menu]);
  };
  
  const handleEditMenu = (updatedMenu: Menu) => {
    setMenuList(menuList.map(menu => menu.id === updatedMenu.id ? updatedMenu : menu));
  };
  
  const handleDeleteMenu = (menuId: string) => {
    setMenuList(menuList.filter(menu => menu.id !== menuId));
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <div className="container mx-auto max-w-md">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold tracking-wider">KITCHEN TIMER</h1>
        </header>
        <main className="p-2">
            <div className="flex flex-col gap-3">
                {timerStates.map(timer => (
                    <TimerCard
                        key={timer.timerId}
                        timerState={timer}
                        onSelectMenu={handleSelectMenu}
                        onStart={handleTimerStart}
                        onStop={handleTimerStop}
                        onReset={handleTimerReset}
                    />
                ))}
            </div>
        </main>
      </div>
      {selectingMenuFor !== null && (
        <MenuPage
          menus={menuList}
          setMenus={setMenuList}
          onSelectMenu={handleMenuChosen}
          onAddMenu={handleAddMenu}
          onEditMenu={handleEditMenu}
          onDeleteMenu={handleDeleteMenu}
          onClose={() => setSelectingMenuFor(null)}
        />
      )}
    </div>
  );
};

export default App;