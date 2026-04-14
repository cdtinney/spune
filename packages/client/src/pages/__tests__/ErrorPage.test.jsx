import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from '../ErrorPage';

describe('ErrorPage', () => {
  it('renders the error message from route params', () => {
    render(
      <MemoryRouter initialEntries={['/error/Something%20went%20wrong']}>
        <Routes>
          <Route path="/error/:errorMsg" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Oops! Something bad happened.')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows default error message when no param', () => {
    render(
      <MemoryRouter initialEntries={['/error/Unknown%20error']}>
        <Routes>
          <Route path="/error/:errorMsg" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Unknown error')).toBeInTheDocument();
  });
});
