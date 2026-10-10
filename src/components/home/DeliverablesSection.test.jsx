import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import DeliverablesSection, { DELIVERABLES } from './DeliverablesSection';

afterEach(() => {
  cleanup();
});

describe('DeliverablesSection Component', () => {
  it('renders deliverable navigation and cards', () => {
    render(<DeliverablesSection />);
    const cardMatches = screen.queryAllByText('Scalable Architecture');
    const dots = screen.queryAllByRole('button', { name: /Go to/i });
    expect(cardMatches.length > 0 || dots.length > 0).toBe(true);
  });

  it('renders the core deliverables in the view', () => {
    render(<DeliverablesSection />);
    expect(screen.getAllByText('Scalable Architecture').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pixel-Perfect UI').length).toBeGreaterThan(0);
  });

  it('displays the description and capabilities modal when clicking a deliverable card', () => {
    render(<DeliverablesSection />);
    const cardBtns = screen.getAllByRole('button', { name: /Scalable Architecture/i });
    fireEvent.click(cardBtns[0]);

    // Modal dialog should be rendered
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Key Standards & Practices')).toBeInTheDocument();
    expect(screen.getAllByText(DELIVERABLES[0].description).length).toBeGreaterThan(0);

    // Closing modal via Close button
    const closeBtn = screen.getByRole('button', { name: /Close details/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when Escape key is pressed', () => {
    render(<DeliverablesSection />);
    const cardBtns = screen.getAllByRole('button', { name: /Scalable Architecture/i });
    fireEvent.click(cardBtns[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
