import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Projects from './Projects';

describe('Projects Route Component', () => {
  it('renders project list and cards properly without being blank', () => {
    render(
      <BrowserRouter>
        <Projects />
      </BrowserRouter>
    );

    expect(screen.getByText('Selected Work')).toBeInTheDocument();
    expect(screen.getByText('Aether E-Commerce')).toBeInTheDocument();
    expect(screen.getByText('Lumina Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Vortex Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Syntax OS')).toBeInTheDocument();
    expect(screen.getByText(/Let's build something together/i)).toBeInTheDocument();
  });

  it('renders centered hero content container', () => {
    const { container } = render(
      <BrowserRouter>
        <Projects />
      </BrowserRouter>
    );

    const heroContent = container.querySelector('.page-hero-content');
    expect(heroContent).toBeInTheDocument();
    expect(heroContent).toHaveClass('page-hero-content');
  });
});
