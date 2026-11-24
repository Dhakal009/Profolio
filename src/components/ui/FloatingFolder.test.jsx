import { lazy } from 'react';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MotionGlobalConfig } from 'framer-motion';
import Layout from '../layout/Layout';
import FloatingFolder from './FloatingFolder';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LenisProvider } from '../../contexts/LenisContext';

const LazyProjects = lazy(() => import('../../routes/Projects'));
const LazyResume = lazy(() => import('../../routes/Resume'));
const LazyTechStack = lazy(() => import('../../routes/TechStack'));

function TestHome() {
  return (
    <section>
      <h1>Home Page</h1>
    </section>
  );
}

describe('FloatingFolder Navigation & Route Transitions', () => {
  let originalMatchMedia;
  let originalIntersectionObserver;
  let originalScrollTo;
  let prevSkipAnimations;

  beforeAll(() => {
    originalMatchMedia = window.matchMedia;
    originalIntersectionObserver = window.IntersectionObserver;
    originalScrollTo = window.scrollTo;
    prevSkipAnimations = MotionGlobalConfig.skipAnimations;

    MotionGlobalConfig.skipAnimations = true;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.IntersectionObserver = class IntersectionObserverMock {
      constructor(callback) {
        this.callback = callback;
      }
      observe(target) {
        this.callback([{ isIntersecting: true, target }], this);
      }
      unobserve() {}
      disconnect() {}
    };

    window.scrollTo = vi.fn();
  });

  afterAll(() => {
    MotionGlobalConfig.skipAnimations = prevSkipAnimations;
    window.matchMedia = originalMatchMedia;
    window.IntersectionObserver = originalIntersectionObserver;
    window.scrollTo = originalScrollTo;
  });

  afterEach(() => {
    cleanup();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.className = '';
    vi.useRealTimers();
  });

  it('opens the page picker modal, locks body scroll, and closes on Escape', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <LenisProvider>
            <FloatingFolder />
          </LenisProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    const trigger = screen.getByRole('button', { name: 'Folder' });
    expect(screen.queryByRole('dialog', { name: 'Quick navigation pages' })).not.toBeInTheDocument();

    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Quick navigation pages' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Projects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resume/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tech Stack/i })).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Quick navigation pages' })).not.toBeInTheDocument();
    });
  });

  it('navigates across lazy routes inside Layout without re-triggering Preloader or duplicating pages', async () => {
    const renderApp = () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<TestHome />} />
              <Route path="/projects" element={<LazyProjects />} />
              <Route path="/resume" element={<LazyResume />} />
              <Route path="/tech-stack" element={<LazyTechStack />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

    const view = renderApp();

    // Wait for initial Preloader (reduced motion = 500ms) to finish once
    await waitFor(
      () => {
        expect(screen.queryByRole('status', { name: /Loading Bikash Dhakal/i })).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(document.body).toHaveClass('is-loaded');
    expect(document.body).not.toHaveClass('is-preloading');
    expect(screen.getByRole('heading', { name: 'Home Page' })).toBeInTheDocument();

    const openModalAndSelect = async (labelRegex) => {
      const folderTrigger = screen.getByRole('button', { name: 'Folder' });
      fireEvent.click(folderTrigger);
      const dialog = await screen.findByRole('dialog', { name: 'Quick navigation pages' });
      expect(document.documentElement.style.overflow).toBe('hidden');
      expect(document.body.style.overflow).toBe('hidden');
      const targetBtn = Array.from(dialog.querySelectorAll('button')).find((btn) =>
        labelRegex.test(btn.textContent || '')
      );
      expect(targetBtn).toBeTruthy();
      fireEvent.click(targetBtn);
    };

    // 1. Navigate to All Projects
    await openModalAndSelect(/All Projects/i);
    await waitFor(() => {
      expect(screen.getByText('Selected Work')).toBeInTheDocument();
    });
    expect(screen.getAllByText('Employee Management System')).toHaveLength(1);
    expect(screen.queryByRole('status', { name: /Loading Bikash Dhakal/i })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass('is-preloading');
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');

    // 2. Navigate to Resume
    await openModalAndSelect(/Resume/i);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Curriculum Vitae' })).toBeInTheDocument();
    });
    expect(screen.getAllByRole('heading', { name: 'Curriculum Vitae' })).toHaveLength(1);
    expect(screen.getByTitle('Bikash Dhakal Resume').tagName).toBe('IFRAME');
    expect(document.querySelector('object[type="application/pdf"]')).toBeNull();
    expect(screen.queryByRole('status', { name: /Loading Bikash Dhakal/i })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass('is-preloading');
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');

    // 3. Navigate to Tech Stack
    await openModalAndSelect(/Tech Stack/i);
    await waitFor(() => {
      expect(screen.getByText('Portfolio Website')).toBeInTheDocument();
    });
    expect(screen.getAllByText('Portfolio Website')).toHaveLength(1);
    expect(screen.getByText('React 19')).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: /Loading Bikash Dhakal/i })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass('is-preloading');
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');

    // 4. Clicking the active route card closes the modal cleanly
    fireEvent.click(screen.getByRole('button', { name: 'Folder' }));
    const dialog = await screen.findByRole('dialog', { name: 'Quick navigation pages' });
    const activeTechBtn = Array.from(dialog.querySelectorAll('button')).find((btn) =>
      /Tech Stack/i.test(btn.textContent || '')
    );
    expect(activeTechBtn).toHaveAttribute('aria-current', 'page');
    fireEvent.click(activeTechBtn);
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Quick navigation pages' })).not.toBeInTheDocument();
    });
    expect(screen.getByText('Portfolio Website')).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');

    // 5. Remounting Layout in the same session does NOT replay Preloader
    view.unmount();
    await act(async () => {
      renderApp();
    });
    expect(screen.queryByRole('status', { name: /Loading Bikash Dhakal/i })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass('is-preloading');
  });
});
