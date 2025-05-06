import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chatbot from '../Chatbot';

describe('Chatbot', () => {
  it('renders chatbot button when closed', () => {
    render(<Chatbot />);
    const button = screen.getByRole('button', { name: /chat/i });
    expect(button).toBeInTheDocument();
  });

  it('opens chatbot when button is clicked', async () => {
    render(<Chatbot />);
    const button = screen.getByRole('button', { name: /chat/i });
    await userEvent.click(button);
    expect(screen.getByText('Housing Assistant')).toBeInTheDocument();
  });

  it('displays welcome message', async () => {
    render(<Chatbot />);
    const button = screen.getByRole('button', { name: /chat/i });
    await userEvent.click(button);
    expect(screen.getByText("Hi! I'm your housing assistant. How can I help you today?")).toBeInTheDocument();
  });
});