import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LinuxTerminal from './LinuxTerminal';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LenisProvider } from '../../contexts/LenisContext';

afterEach(() => {
  cleanup();
});

function renderTerminal() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <LenisProvider>
          <LinuxTerminal />
        </LenisProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('LinuxTerminal Component', () => {
  it('renders terminal window with header, title, and initial welcome session', () => {
    renderTerminal();

    expect(screen.getByRole('region', { name: /interactive linux terminal/i })).toBeInTheDocument();
    expect(screen.getByText(/bikash@portfolio: ~ \(bash\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to BikashOS/i)).toBeInTheDocument();
  });

  it('renders quick action chips for immediate command execution', () => {
    renderTerminal();

    expect(screen.getByRole('button', { name: 'help' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'neofetch' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cat bio.txt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cd projects' })).toBeInTheDocument();
  });

  it('executes help command and displays available command categories', () => {
    renderTerminal();

    const helpBtn = screen.getByRole('button', { name: 'help' });
    fireEvent.click(helpBtn);

    expect(screen.getByText(/Available Linux & Portfolio Commands/i)).toBeInTheDocument();
    expect(screen.getByText(/Navigation:/i)).toBeInTheDocument();
  });

  it('executes cat bio.txt command and renders developer biography', () => {
    renderTerminal();

    const bioBtn = screen.getByRole('button', { name: 'cat bio.txt' });
    fireEvent.click(bioBtn);

    expect(screen.getByText(/BIKASH DHAKAL — FULL STACK DEVELOPER & UI DESIGNER/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Kathmandu, Nepal/i).length).toBeGreaterThanOrEqual(2);
  });

  it('executes user input commands through the command line prompt', () => {
    renderTerminal();

    const input = screen.getByPlaceholderText(/Type 'help', 'neofetch', or 'cd projects'/i);
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.submit(input);

    expect(screen.getByText(/Full Stack Engineer & UI Designer from Kathmandu, Nepal/i)).toBeInTheDocument();
  });

  it('clears screen when clear button or command is run', () => {
    renderTerminal();

    const clearBtn = screen.getByTitle('Clear terminal');
    fireEvent.click(clearBtn);

    expect(screen.queryByText(/Welcome to BikashOS/i)).not.toBeInTheDocument();
  });

  it('toggles minimize and expand window modes', () => {
    const { container } = renderTerminal();
    const terminalEl = container.querySelector('.terminal-container');

    const maxBtn = screen.getByLabelText(/Expand terminal/i);
    fireEvent.click(maxBtn);
    expect(terminalEl).toHaveClass('is-expanded');

    const minBtn = screen.getByLabelText(/Minimize terminal/i);
    fireEvent.click(minBtn);
    expect(terminalEl).toHaveClass('is-minimized');
  });
});
