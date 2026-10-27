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
        setScale(0.3);
      } else {
        setScale(0.36);
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
  const folderColor = isDark ? '#1a1a1c' : '#d4d4d8';
  const paperColor = isDark ? '#f4f4f5' : '#ffffff';

  const items = useMemo(() => [
    {
      id: 'all-projects',
      title: 'All Projects',
      path: '/projects',
      content: (
        <div
          className="h-full w-full flex flex-col justify-between select-none text-left"
          style={{
            background: 'var(--card-bg)',
            color: 'var(--foam)',
            padding: 'calc(13px * var(--folder-scale))'
          }}
        >
          <div>
            <div className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 'calc(7px * var(--folder-scale))', color: 'var(--muted)' }}>
              01 / Work
            </div>
            <div className="mt-1 font-semibold leading-tight" style={{ fontSize: 'calc(11px * var(--folder-scale))' }}>
              All Projects
            </div>
          </div>
          <div>
            <div style={{ height: '1px', background: 'var(--line)', marginBottom: 'calc(6px * var(--folder-scale))' }} />
            <div className="leading-tight" style={{ fontSize: 'calc(7px * var(--folder-scale))', color: 'var(--muted)' }}>
              Explore selected work
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'resume',
      title: 'Resume',
      path: '/resume',
      content: (
        <div
          className="h-full w-full flex flex-col justify-between select-none text-left"
          style={{
            background: 'var(--card-bg)',
            color: 'var(--foam)',
            padding: 'calc(13px * var(--folder-scale))'
          }}
        >
          <div>
            <div className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 'calc(7px * var(--folder-scale))', color: 'var(--muted)' }}>
              02 / Profile
            </div>
            <div className="mt-1 font-semibold leading-tight" style={{ fontSize: 'calc(11px * var(--folder-scale))' }}>
              Resume
            </div>
          </div>
          <div>
            <div style={{ height: '1px', background: 'var(--line)', marginBottom: 'calc(6px * var(--folder-scale))' }} />
            <div className="leading-tight" style={{ fontSize: 'calc(7px * var(--folder-scale))', color: 'var(--muted)' }}>
              Experience &amp; skills
            </div>
          </div>
        </div>
      )
    }
  ], []);

  const handleItemClick = (item) => {
    if (item?.path) {
      setIsOpen(false);
      navigate(item.path);
    }
  };

  return (
    <div
      className="floating-folder fixed bottom-[5.75rem] right-3 sm:bottom-5 sm:right-10 z-[88] flex flex-col items-end pointer-events-none"
      aria-label="Floating quick navigation folder"
    >
      <div className="pointer-events-auto">
        <Folder
          size={scale}
          mode="flap"
          variant="solid"
          color={folderColor}
          paperColor={paperColor}
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
