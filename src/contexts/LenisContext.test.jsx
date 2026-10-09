import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LenisProvider, useLenis } from './LenisContext';

function TestConsumer() {
  const { lenis, isReady } = useLenis();

  return (
    <div>
      <span data-testid="lenis-status">{lenis ? 'ready' : 'missing'}</span>
      <span data-testid="ready-status">{isReady ? 'ready' : 'loading'}</span>
    </div>
  );
}

describe('LenisProvider', () => {
  it('exposes the active Lenis instance to consumers', async () => {
    render(
      <LenisProvider>
        <TestConsumer />
      </LenisProvider>
    );

    expect(await screen.findByTestId('ready-status')).toHaveTextContent('ready');
    expect(screen.getByTestId('lenis-status')).toHaveTextContent('ready');
  });
});
