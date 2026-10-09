import { render, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LenisProvider } from '../../contexts/LenisContext';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function renderHeader(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider>
        <LenisProvider>
          <Header />
        </LenisProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Header Component', () => {
  it('does not render home button or title on home screen at top hero', () => {
    const { container } = renderHeader('/');

    const homeBtn = container.querySelector('.header-home-btn');
    expect(homeBtn).not.toBeInTheDocument();
  });

  it('renders home button and modern page title on other pages (e.g. /projects)', () => {
    const { container } = renderHeader('/projects');

    const homeBtn = container.querySelector('.header-home-btn');
    expect(homeBtn).toBeInTheDocument();
    expect(homeBtn).toHaveTextContent('Home');

    const pageTitle = container.querySelector('.header-page-title');
    expect(pageTitle).toBeInTheDocument();
    expect(pageTitle).toHaveTextContent('Projects');
  });

  it('renders search trigger button and opens search modal on click', () => {
    const { container } = renderHeader('/');

    const searchBtn = container.querySelector('.search-toggle-btn');
    expect(searchBtn).toBeInTheDocument();

    expect(container.querySelector('.search-backdrop')).not.toBeInTheDocument();

    fireEvent.click(searchBtn);
    expect(container.querySelector('.search-backdrop')).toBeInTheDocument();
    expect(container.querySelector('.search-input-field')).toBeInTheDocument();
  });

  it('hides dock only when scrolling and shows it when scrolling stops', () => {
    vi.useFakeTimers();
    const { container } = renderHeader('/');
    const dock = container.querySelector('.dock');

    expect(dock).not.toHaveClass('is-hidden');

    // Start scrolling -> hides dock
    act(() => {
      window.scrollY = 150;
      fireEvent.scroll(window);
    });
    expect(dock).toHaveClass('is-hidden');

    // Scrolling stops -> reveals dock after timer
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(dock).not.toHaveClass('is-hidden');
  });
});
