import { classifyAmazonUrl, normalizeAmazonProfileUrl } from './amazonProfileUrl';

describe('classifyAmazonUrl', () => {
  it.each([
    ['https://www.amazon.es/gp/profile/amzn1.account.AE3ABC'],
    ['https://www.amazon.com/gp/profile/amzn1.account.AE3ABC'],
    ['https://www.amazon.com.mx/gp/profile/amzn1.account.AE3ABC'],
    ['https://www.amazon.co.uk/gp/profile/amzn1.account.AE3ABC'],
  ])('classifies a profile URL (%s) as "profile"', (url) => {
    expect(classifyAmazonUrl(url)).toBe('profile');
  });

  it('classifies a profile URL without protocol as "profile"', () => {
    expect(classifyAmazonUrl('amazon.es/gp/profile/amzn1.account.AE3ABC')).toBe('profile');
  });

  it('classifies a profile URL with ref= and query params as "profile"', () => {
    expect(classifyAmazonUrl('amazon.es/gp/profile/amzn1.account.AE3ABC/ref=cm_cr_dp_d_gw_tr?ie=UTF8')).toBe('profile');
  });

  // Real shape Amazon hands out via "Mi cuenta → Mi contenido" (fake ID).
  it.each([
    ['https://www.amazon.es/gp/profile/amzn1.account.AEXAMPLEFAKEID123?ref_=ya_d_l_profile'],
    ['amazon.es/gp/profile/amzn1.account.AEXAMPLEFAKEID123?ref_=ya_d_l_profile'],
  ])('classifies a "Mi contenido" profile URL with ?ref_= (%s) as "profile"', (url) => {
    expect(classifyAmazonUrl(url)).toBe('profile');
  });

  it.each([
    ['https://www.amazon.es/dp/B08XYZ1234'],
    ['https://www.amazon.com/gp/product/B08XYZ1234'],
  ])('classifies a product URL (%s) as "product"', (url) => {
    expect(classifyAmazonUrl(url)).toBe('product');
  });

  it.each([
    ['https://www.amazon.es/gp/css/homepage.html'],
    ['https://www.amazon.com/hz/wishlist/ls/ABCDEF'],
  ])('classifies an account URL (%s) as "account"', (url) => {
    expect(classifyAmazonUrl(url)).toBe('account');
  });

  it.each([
    ['https://amzn.eu/d/abcdef'],
    ['https://a.co/d/abcdef'],
  ])('classifies a shortened URL (%s) as "short"', (url) => {
    expect(classifyAmazonUrl(url)).toBe('short');
  });

  it.each([
    ['https://www.goodreads.com/user/show/12345'],
    [''],
    ['no es una url'],
  ])('classifies a non-Amazon input (%s) as "other"', (url) => {
    expect(classifyAmazonUrl(url)).toBe('other');
  });

  it('classifies a lookalike host (amazon.es.fake.com) as "other"', () => {
    expect(classifyAmazonUrl('https://amazon.es.fake.com/gp/profile/amzn1.account.AE3ABC')).toBe('other');
  });
});

describe('normalizeAmazonProfileUrl', () => {
  it('strips ref= and query params from a valid profile URL', () => {
    expect(normalizeAmazonProfileUrl('amazon.es/gp/profile/amzn1.account.AE3ABC/ref=cm_cr_dp_d_gw_tr?ie=UTF8'))
      .toBe('https://www.amazon.es/gp/profile/amzn1.account.AE3ABC');
  });

  it.each([
    ['https://www.amazon.es/gp/profile/amzn1.account.AEXAMPLEFAKEID123?ref_=ya_d_l_profile'],
    ['amazon.es/gp/profile/amzn1.account.AEXAMPLEFAKEID123?ref_=ya_d_l_profile'],
  ])('strips the ?ref_= query from a "Mi contenido" profile URL (%s)', (url) => {
    expect(normalizeAmazonProfileUrl(url))
      .toBe('https://www.amazon.es/gp/profile/amzn1.account.AEXAMPLEFAKEID123');
  });

  it('always adds the www. prefix, even if the input omits it', () => {
    expect(normalizeAmazonProfileUrl('https://amazon.com/gp/profile/amzn1.account.AE3ABC'))
      .toBe('https://www.amazon.com/gp/profile/amzn1.account.AE3ABC');
  });

  it.each([
    ['https://www.amazon.es/dp/B08XYZ1234'],
    ['https://www.amazon.es/gp/css/homepage.html'],
    ['https://amzn.eu/d/abcdef'],
    ['https://www.goodreads.com/user/show/12345'],
  ])('returns null for a non-profile URL (%s)', (url) => {
    expect(normalizeAmazonProfileUrl(url)).toBeNull();
  });
});
