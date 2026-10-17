import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Folder from './Folder';

export default function FloatingFolder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(0.44);

  // Responsive scale: compact and proportional
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScale(0.38);
      } else {
        setScale(0.44);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close folder if route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isDark = theme === 'dark';
  // Black & white theme matching website
  const folderColor = isDark ? '#1a1a1c' : '#262629';

  const items = useMemo(
    () => [
      {
        id: 'projects',
        title: 'View Projects',
        description: 'Selected works & gallery',
        path: '/projects',
        content: (
          <div className="h-full w-full p-2 flex flex-col justify-start bg-white text-zinc-900 select-none text-left">
            <div className="text-[9.5px] font-bold text-zinc-950 leading-tight">
              View Projects
            </div>
            <div className="text-[7.5px] text-zinc-500 leading-snug mt-1">
              Selected works & gallery
            </div>
          </div>
        )
      },
      {
        id: 'resume',
        title: 'View Resume Page',
        description: 'Career history & PDF CV',
        path: '/resume',
        content: (
          <div className="h-full w-full p-2 flex flex-col justify-start bg-white text-zinc-900 select-none text-left">
            <div className="text-[9.5px] font-bold text-zinc-950 leading-tight">
              View Resume Page
            </div>
            <div className="text-[7.5px] text-zinc-500 leading-snug mt-1">
              Career history & PDF CV
            </div>
          </div>
        )
      }
    ],
    []
  );

  const handleItemClick = (item) => {
    if (item?.path) {
      setIsOpen(false);
      navigate(item.path);
    }
  };

  return (
    <div
      className="fixed bottom-3 right-6 sm:bottom-5 sm:right-5 z-[88] flex flex-col items-end pointer-events-none"
      aria-label="Floating quick navigation folder"
    >
      <div className="pointer-events-auto">
        <Folder
          size={scale}
          mode="flap"
          variant="solid"
          color={folderColor}
          paperColor="#ffffff"
          items={items}
          open={isOpen}
          onOpenChange={setIsOpen}
          onItemClick={handleItemClick}
          zoomOnClick={false}
          draggable={false}
          peek={true}
          theme={isDark ? 'dark' : 'light'}
          closeOnOutsideClick={true}
        />
      </div>
    </div>
  );
}
