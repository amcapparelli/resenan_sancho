import { isTikTokUrl, normalizeTikTokUrl } from './tiktokUrl';

describe('isTikTokUrl', () => {
  it.each([
    'https://www.tiktok.com/@lectora',
    'https://tiktok.com/@lectora',
    'https://vm.tiktok.com/ZMabc123/',
    'http://www.tiktok.com/@lectora',
    'HTTPS://WWW.TIKTOK.COM/@Lectora',
    'www.tiktok.com/@lectora',
    '  https://www.tiktok.com/@lectora  ',
  ])('accepts a TikTok host: %s', (input) => {
    expect(isTikTokUrl(input)).toBe(true);
  });

  it.each([
    'https://www.instagram.com/lectora',
    'https://m.tiktok.com/@lectora',
    'https://tiktok.com.fake.io/@lectora',
    'https://nottiktok.com/@lectora',
    'https://example.com/?u=tiktok.com',
  ])('rejects other domains: %s', (input) => {
    expect(isTikTokUrl(input)).toBe(false);
  });

  it.each([
    '',
    '   ',
    'https://',
    'not a url',
    // Only http(s) is recognised as a protocol, so this parses as
    // `https://ftp://...` with host `ftp` — not a TikTok link.
    'ftp://www.tiktok.com/@lectora',
  ])('rejects malformed input: %p', (input) => {
    expect(isTikTokUrl(input)).toBe(false);
  });
});

describe('normalizeTikTokUrl', () => {
  it.each([
    ['tiktok.com/@lectora', 'https://tiktok.com/@lectora'],
    ['www.tiktok.com/@lectora', 'https://www.tiktok.com/@lectora'],
    ['  https://vm.tiktok.com/ZMabc123/  ', 'https://vm.tiktok.com/ZMabc123/'],
    ['http://www.tiktok.com/@lectora', 'http://www.tiktok.com/@lectora'],
  ])('normalizes %p to %p', (input, expected) => {
    expect(normalizeTikTokUrl(input)).toBe(expected);
  });
});
