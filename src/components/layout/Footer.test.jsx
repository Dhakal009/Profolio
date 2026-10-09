import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';
import { LenisProvider } from '../../contexts/LenisContext';

afterEach(() => {
  cleanup();
});

function renderFooter() {
  return render(
    <MemoryRouter>
      <LenisProvider>
        <Footer />
      </LenisProvider>
    </MemoryRouter>
  );
}

describe('Clean Editorial Brutalist Footer Component', () => {
  it('renders sitemap links with 01 prefix', () => {
    renderFooter();

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText(/SITEMAP/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Works' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
  });

  it('renders socials and infos columns', () => {
    renderFooter();

    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText(/SOCIALS/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();

    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getAllByText(/INFOS/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Kathmandu, Nepal/i)).toBeInTheDocument();
  });

  it('renders "LET\'S WORK TOGETHER" CTA link', () => {
    renderFooter();

    const ctaLink = screen.getByRole('link', { name: /let's work together/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', 'mailto:bikashdhakal546@gmail.com');
  });

  it('renders giant uppercase name and eyebrow text', () => {
    renderFooter();

    expect(screen.getByText(/FULL STACK DEVELOPER \/ CREATIVE TECHNOLOGIST/i)).toBeInTheDocument();
    expect(screen.getByText(/PORTFOLIO 2026/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'BIKASH DHAKAL' })).toBeInTheDocument();
  });

  it('does not render back to top button in footer', () => {
    renderFooter();

    expect(screen.queryByRole('button', { name: /scroll back to top/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/back to top/i)).not.toBeInTheDocument();
  });
});
