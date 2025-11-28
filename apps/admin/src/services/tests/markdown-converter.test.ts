import {describe, expect, test} from 'vitest';
import {toHTML} from '../markdown-converter';

describe('markdown converter', () => {
  test('renders markdown into HTML using Remarkable configuration', () => {
    const html = toHTML('# Title\n\nParagraph with **bold** and a line break\\\nnext line.');

    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('line break<br>');
    expect(html).toContain('<br>\nnext line.');
  });
});
