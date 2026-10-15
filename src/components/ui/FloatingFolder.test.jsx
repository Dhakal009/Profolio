// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FloatingFolder from './FloatingFolder';
import { ThemeProvider } from '../../contexts/ThemeContext';

afterEach(() => {
  cleanup();
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderFloatingFolder(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider>
        <FloatingFolder />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('FloatingFolder Component', () => {
  it('renders the floating folder in the bottom right corner without Pages text', () => {
    const { container } = renderFloatingFolder();
    expect(screen.queryByText('Pages')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Folder')).toBeInTheDocument();
    expect(container.querySelector('[data-mode="flap"]')).toBeInTheDocument();
  });

  it('contains "View Projects" and "View Resume Page" items', () => {
    renderFloatingFolder();
    expect(screen.getByText('View Projects')).toBeInTheDocument();
    expect(screen.getByText('View Resume Page')).toBeInTheDocument();
  });

  it('navigates to /projects when clicking View Projects', () => {
    renderFloatingFolder();
    const folderStage = screen.getByLabelText('Folder');
    // Open the folder
    fireEvent.click(folderStage);

    const projectItem = screen.getByText('View Projects').closest('[data-folder-item]');
    expect(projectItem).toBeInTheDocument();
    fireEvent.click(projectItem);

    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('navigates to /resume when clicking View Resume Page', () => {
    renderFloatingFolder();
    const folderStage = screen.getByLabelText('Folder');
    // Open the folder
    fireEvent.click(folderStage);

    const resumeItem = screen.getByText('View Resume Page').closest('[data-folder-item]');
    expect(resumeItem).toBeInTheDocument();
    fireEvent.click(resumeItem);

    expect(mockNavigate).toHaveBeenCalledWith('/resume');
  });
});
