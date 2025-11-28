import {describe, expect, test} from 'vitest';
import {getKeyFromName, getPlural} from '../texts';

describe('texts utils', () => {
  test('getKeyFromName normalizes whitespace, strips symbols, and lowercases', () => {
    expect(getKeyFromName('API Key Name!')).toBe('api_key_name');
    expect(getKeyFromName('Complex  Name@@@')).toBe('complex__name');
  });

  test('getPlural adds es suffix for x, h, or s endings', () => {
    expect(getPlural('box')).toBe('boxes');
    expect(getPlural('Brush')).toBe('Brushes');
    expect(getPlural('glass')).toBe('glasses');
  });

  test('getPlural handles y ending and defaults to adding s', () => {
    expect(getPlural('company')).toBe('companies');
    expect(getPlural('car')).toBe('cars');
  });
});
