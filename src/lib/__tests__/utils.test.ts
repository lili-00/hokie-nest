import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('base-class', 'additional-class', { 'conditional-class': true });
    expect(result).toBe('base-class additional-class conditional-class');
  });

  it('handles conditional classes', () => {
    const result = cn('base-class', { 'true-class': true, 'false-class': false });
    expect(result).toBe('base-class true-class');
  });

  it('handles array of classes', () => {
    const result = cn(['class-1', 'class-2'], 'class-3');
    expect(result).toBe('class-1 class-2 class-3');
  });

  it('handles undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('handles empty strings', () => {
    const result = cn('', 'valid-class', '');
    expect(result).toBe('valid-class');
  });

  it('handles multiple conditional classes', () => {
    const result = cn('base', {
      'true-1': true,
      'false-1': false,
      'true-2': true,
      'false-2': false,
    });
    expect(result).toBe('base true-1 true-2');
  });

  it('handles mixed input types', () => {
    const result = cn(
      'base',
      ['array-1', 'array-2'],
      { conditional: true },
      undefined,
      null,
      false,
      'direct'
    );
    expect(result).toBe('base array-1 array-2 conditional direct');
  });
});