// @vitest-environment jsdom
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, afterEach, vi } from 'vitest';
import FluidGlass from './FluidGlass';
import Hero from '../hero/Hero';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('FluidGlass Component', () => {
  it('renders canvas and container without crashing in JSDOM', () => {
    render(
      <FluidGlass text="Look closer." shape="lens" size={260}>
        <div data-testid="glass-child">Child Content</div>
      </FluidGlass>
    );

    expect(screen.getByTestId('glass-child')).toBeInTheDocument();
    expect(screen.getByText('Look closer.')).toBeInTheDocument();
  });

  it('renders accessible text in screen-reader only paragraph', () => {
    render(<FluidGlass text="Refracted Headline" />);
    const srText = screen.getByText('Refracted Headline');
    expect(srText).toHaveClass('sr-only');
  });
});

describe('Hero Component with Refraction Glass Integration', () => {
  it('renders hero with accessible heading and enlarged text words', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'hero-name');
    expect(heading.textContent).toContain('BIKASH');
    expect(heading.textContent).toContain('DHAKAL');
  });

  it('renders avatar in front with proper z-index', () => {
    render(<Hero />);
    const avatar = screen.getByAltText('Bikash Dhakal');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveStyle({ zIndex: '10' });
  });

  it('does not render unnecessary overlay texts or navbars', () => {
    render(<Hero />);
    expect(screen.queryByText(/Available for Projects/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Refraction Glass Engine/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Click glass to morph/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mode: Follow/i)).not.toBeInTheDocument();
  });

  it('toggles glass visibility on double click', async () => {
    vi.useFakeTimers();
    render(<Hero />);
    const heroRegion = screen.getByRole('region', { name: /Hero Section/i });

    // First click
    fireEvent.click(heroRegion);
    // Second click within 240ms => double click triggers hide
    fireEvent.click(heroRegion);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const glassWrapper = heroRegion.querySelector('.opacity-0');
    expect(glassWrapper).toBeInTheDocument();
  });
});
