import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Projects from './Projects';

describe('Projects Route Component', () => {
  it('renders project list and cards from the Projects folder with Live Demo and Source Code links', () => {
    render(
      <BrowserRouter>
        <Projects />
      </BrowserRouter>
    );

    expect(screen.getByText('Selected Work')).toBeInTheDocument();
    expect(screen.getByText('Employee Management System')).toBeInTheDocument();
    expect(screen.getByText('Live Chat Application')).toBeInTheDocument();
    expect(screen.getByText('E-Commerce App')).toBeInTheDocument();
    expect(screen.getByText(/Let's build something together/i)).toBeInTheDocument();

    const emsDemoLink = screen.getByRole('link', {
      name: /Launch Employee Management System live demo/i,
    });
    expect(emsDemoLink).toHaveAttribute('href', '/demo/ems');

    const emsSourceLink = screen.getByRole('link', {
      name: /View Employee Management System source code on GitHub/i,
    });
    expect(emsSourceLink).toHaveAttribute(
      'href',
      'https://github.com/Dhakal009/Profolio/tree/master/Projects/EMS'
    );
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
