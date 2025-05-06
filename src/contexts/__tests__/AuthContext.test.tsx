import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { mockSupabase } from '../../test/utils';

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
      error: null
    });
  });

  it('provides initial auth state', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('updates auth state when session changes', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: '',
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { 
        session: { 
          user: mockUser,
          access_token: 'token',
          refresh_token: 'refresh',
          expires_in: 3600,
        }
      },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('handles auth state change events', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: '',
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const [callback] = mockSupabase.auth.onAuthStateChange.mock.calls[0];
      callback('SIGNED_IN', { 
        user: mockUser,
        access_token: 'token',
        refresh_token: 'refresh',
        expires_in: 3600,
      });
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('cleans up subscription on unmount', async () => {
    const unsubscribe = vi.fn();
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe } },
      error: null,
    });

    const { unmount } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});