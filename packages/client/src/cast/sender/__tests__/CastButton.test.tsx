import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CastButton from '../CastButton';

describe('CastButton', () => {
  it('renders nothing when not available', () => {
    const { container } = render(
      <CastButton available={false} connected={false} onConnect={vi.fn()} onDisconnect={vi.fn()} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders when available', () => {
    render(
      <CastButton available={true} connected={false} onConnect={vi.fn()} onDisconnect={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Cast to device' })).toBeInTheDocument();
  });

  it('calls onConnect when clicked and not connected', async () => {
    const onConnect = vi.fn();
    render(
      <CastButton
        available={true}
        connected={false}
        onConnect={onConnect}
        onDisconnect={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onConnect).toHaveBeenCalled();
  });

  it('calls onDisconnect when clicked and connected', async () => {
    const onDisconnect = vi.fn();
    render(
      <CastButton
        available={true}
        connected={true}
        onConnect={vi.fn()}
        onDisconnect={onDisconnect}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stop casting' }));
    expect(onDisconnect).toHaveBeenCalled();
  });

  it('shows connected styling when casting', () => {
    render(
      <CastButton available={true} connected={true} onConnect={vi.fn()} onDisconnect={vi.fn()} />,
    );
    expect(screen.getByRole('button')).toHaveClass('cast-button--connected');
  });
});
