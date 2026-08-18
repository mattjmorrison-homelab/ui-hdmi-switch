import { describe, expect, it } from 'vitest';
import { errorMessage } from './errorMessage';

describe('errorMessage', () => {
  it('returns the message from an Error instance', () => {
    expect(errorMessage(new Error('device unreachable'))).toBe('device unreachable');
  });

  it('falls back to a generic message for non-Error values', () => {
    expect(errorMessage('a plain string, not an Error')).toBe('Something went wrong.');
    expect(errorMessage(undefined)).toBe('Something went wrong.');
  });
});
