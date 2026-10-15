// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AboutSection from './AboutSection';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LenisProvider } from '../../contexts/LenisContext';

if (!('IntersectionObserver' in globalThis)) {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderAboutSection() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <LenisProvider>
          <AboutSection />
        </LenisProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('AboutSection Component', () => {
  it('renders minimal developer information and action links on left side', () => {
    renderAboutSection();

    expect(screen.getByText(/01 \/ About Me/i)).toBeInTheDocument();
    expect(screen.getByText(/Building digital experiences with care & engineering rigor\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/Bikash Dhakal/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Kathmandu, Nepal/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Available for roles/i)).toBeInTheDocument();

    const viewProjectsLink = screen.getByRole('link', { name: /View Projects/i });
    expect(viewProjectsLink).toBeInTheDocument();
    expect(viewProjectsLink).toHaveAttribute('href', '#projects');

    const githubLink = screen.getByRole('link', { name: /GitHub/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Dhakal009');
  });

  it('renders the interactive LinuxTerminal on the right side', () => {
    const { container } = renderAboutSection();

    // Verify terminal presence
    const terminalEl = container.querySelector('.terminal-window') || container.querySelector('.terminal-container');
    expect(terminalEl).toBeInTheDocument();

    // Verify interactive terminal elements (prompt, help or quick chips)
    expect(screen.getAllByText(/bikash@portfolio/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders JSON formatted card and allows copying JSON', async () => {
    // Mock navigator.clipboard
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    const { fireEvent } = await import('@testing-library/react');
    renderAboutSection();

    expect(screen.getByText('about.json')).toBeInTheDocument();
    expect(screen.getByText('"developer"')).toBeInTheDocument();
    expect(screen.getByText('"stack"')).toBeInTheDocument();

    const copyBtn = screen.getByLabelText(/Copy about JSON/i);
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock.mock.calls[0][0]).toContain('Bikash Dhakal');
    expect(writeTextMock.mock.calls[0][0]).toContain('Kathmandu, Nepal');
  });
});
