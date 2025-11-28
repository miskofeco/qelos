import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {getItem, removeItem, setItem} from '../storage';

describe('storage utils', () => {
  const backingStore = new Map<string, string>();

  const fakeStorage = {
    getItem: vi.fn((key: string) => backingStore.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      backingStore.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      backingStore.delete(key);
    }),
  };

  beforeEach(() => {
    backingStore.clear();
    fakeStorage.getItem.mockClear();
    fakeStorage.setItem.mockClear();
    fakeStorage.removeItem.mockClear();
    vi.stubGlobal('localStorage', fakeStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('parses stored JSON values and returns parsed object', () => {
    backingStore.set('user', JSON.stringify({id: 1, name: 'Ada'}));

    expect(getItem('user')).toEqual({id: 1, name: 'Ada'});
    expect(fakeStorage.getItem).toHaveBeenCalledWith('user');
  });

  test('falls back to defaults on missing key and preserves invalid JSON', () => {
    expect(getItem('missing', {fallback: true})).toEqual({fallback: true});

    backingStore.set('token', '{not-json');
    expect(getItem('token', 'default-token')).toBe('{not-json');
  });

  test('stringifies values when setting and removes entries', () => {
    setItem('settings', {theme: 'dark'});

    expect(backingStore.get('settings')).toBe(JSON.stringify({theme: 'dark'}));
    expect(fakeStorage.setItem).toHaveBeenCalledWith('settings', JSON.stringify({theme: 'dark'}));

    removeItem('settings');
    expect(backingStore.has('settings')).toBe(false);
    expect(fakeStorage.removeItem).toHaveBeenCalledWith('settings');
  });
});
