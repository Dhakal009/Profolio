import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SelectedWorkScroll from './SelectedWorkScroll';
import { LenisProvider } from '../../contexts/LenisContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

afterEach(() => {
  cleanup();
  mockNavigate.mockClear();
});

function renderSelectedWork() {
  return render(
    <MemoryRouter>
      <LenisProvider>
        <SelectedWorkScroll />
      </LenisProvider>
    </MemoryRouter>
  );
}

describe('SelectedWorkScroll Component', () => {
  it('renders the main headline and section container with id projects-preview', () => {
    const { container } = renderSelectedWork();
    const section = container.querySelector('#projects-preview');
    expect(section).toBeInTheDocument();
    const headline = container.querySelector('.ps-headline');
    expect(headline).toBeInTheDocument();
    expect(headline).toHaveTextContent(/Built for what comes next/i);
  });

  it('renders View Works button and redirects to /projects when clicked', () => {
    const { container } = renderSelectedWork();

    const viewWorksBtn = container.querySelector('.ps-cta');
    expect(viewWorksBtn).toBeInTheDocument();
    expect(viewWorksBtn).toHaveTextContent('View Works');

    fireEvent.click(viewWorksBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('redirects to hosted live demo when a project card is clicked or activated with Enter', () => {
    const { container } = renderSelectedWork();

    const card = container.querySelector('.ps-tile');
    expect(card).toBeInTheDocument();

    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/demo/ems');

    mockNavigate.mockClear();
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/demo/ems');
  });

  it('renders scroll indicator and step-aside description', () => {
    renderSelectedWork();
    expect(screen.getByText(/Scroll/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A selection of recent work, from first sketch to shipped product/i)
    ).toBeInTheDocument();
  });
});
