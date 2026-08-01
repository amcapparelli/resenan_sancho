/**
 * Key parity between the bundled locales. A key that exists in `es` but not in
 * `en` (or the other way round) ships the raw key path to the user, and nothing
 * else in the app catches it.
 *
 * This checks KEYS ONLY on purpose: the wording of each locale is the owner's
 * call and must stay editable without any test pushing back.
 */
import esCommon from '../public/static/locales/es/common.json';
import enCommon from '../public/static/locales/en/common.json';

type TranslationNode = { [key: string]: TranslationNode | string };

const collectKeyPaths = (node: TranslationNode, prefix = ''): string[] => (
  Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [path] : collectKeyPaths(value, path);
  })
);

describe('locale bundles', () => {
  it('expose the same keys in es and en', () => {
    const esKeys = collectKeyPaths(esCommon as TranslationNode).sort();
    const enKeys = collectKeyPaths(enCommon as TranslationNode).sort();

    expect(esKeys).toEqual(enKeys);
  });

  it('expose the whole country selector copy in both locales', () => {
    const expectedKeys = ['title', 'placeholder', 'note', 'emptyNote'].sort();

    expect(Object.keys(esCommon.components.countriesSelector).sort()).toEqual(expectedKeys);
    expect(Object.keys(enCommon.components.countriesSelector).sort()).toEqual(expectedKeys);
  });
});
