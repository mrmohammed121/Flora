import assert from 'assert';
import fs from 'fs';
import { translations } from '../src/locales/translations.js';

const enJson = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const knJson = JSON.parse(fs.readFileSync('src/locales/kn.json', 'utf8'));
const hiJson = JSON.parse(fs.readFileSync('src/locales/hi.json', 'utf8'));

console.log('--- TEST 1: Locale JSON files integrity ---');
assert.strictEqual(Object.keys(enJson).length, Object.keys(translations.en).length);
assert.strictEqual(Object.keys(knJson).length, Object.keys(translations.kn).length);
assert.strictEqual(Object.keys(hiJson).length, Object.keys(translations.hi).length);
console.log('✓ All JSON files match translations.js dictionary lengths:', Object.keys(enJson).length);

console.log('\n--- TEST 2: Missing keys check ---');
assert.ok(translations.en.pdfError, 'en.pdfError must exist');
assert.ok(translations.kn.pdfError, 'kn.pdfError must exist');
assert.ok(translations.hi.pdfError, 'hi.pdfError must exist');
console.log('✓ pdfError is present across all languages');

console.log('\n--- TEST 3: resolveTranslation & safe t() helper simulation ---');
function resolveTranslation(dict, key) {
  if (!dict || !key || typeof key !== 'string') return undefined;

  if (dict[key] !== undefined && dict[key] !== null) {
    return dict[key];
  }

  if (key.includes('.')) {
    const parts = key.split('.');
    let cur = dict;
    for (const part of parts) {
      if (cur === undefined || cur === null || typeof cur !== 'object') {
        return undefined;
      }
      cur = cur[part];
    }
    if (cur !== undefined && cur !== null) {
      return cur;
    }
  }

  return undefined;
}

function createT(language) {
  return function t(key, paramsOrFallback = '', fallback = '') {
    if (!key || typeof key !== 'string') {
      if (typeof paramsOrFallback === 'string') return paramsOrFallback;
      if (typeof fallback === 'string') return fallback;
      return '';
    }

    let params = null;
    let actualFallback = '';

    if (typeof paramsOrFallback === 'object' && paramsOrFallback !== null) {
      params = paramsOrFallback;
      actualFallback = typeof fallback === 'string' ? fallback : '';
    } else if (typeof paramsOrFallback === 'string') {
      actualFallback = paramsOrFallback;
    } else if (typeof fallback === 'string') {
      actualFallback = fallback;
    }

    const activeDict = (translations && translations[language]) ? translations[language] : (translations?.en || {});
    const fallbackDict = translations?.en || {};

    let rawText = resolveTranslation(activeDict, key);

    if (rawText === undefined || rawText === null) {
      rawText = resolveTranslation(fallbackDict, key);
    }

    let text;
    if (rawText !== undefined && rawText !== null) {
      if (typeof rawText === 'object') {
        text = actualFallback || key;
      } else {
        text = String(rawText);
      }
    } else {
      text = actualFallback || key;
    }

    if (params && typeof text === 'string') {
      Object.keys(params).forEach((paramKey) => {
        const val = params[paramKey] !== undefined && params[paramKey] !== null ? params[paramKey] : '';
        const escapedParamKey = paramKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        text = text.replace(new RegExp(`\\{\\{?\\s*${escapedParamKey}\\s*\\}?}`, 'g'), String(val));
      });
    }

    return text;
  };
}

const tEn = createT('en');
const tKn = createT('kn');
const tHi = createT('hi');

// Test basic keys
assert.strictEqual(tEn('navStudio'), 'Diagnostic Studio');
assert.strictEqual(tKn('navStudio'), 'ರೋಗನಿರ್ಣಯ ಸ್ಟುಡಿಯೋ');
assert.strictEqual(tHi('navStudio'), 'निदान स्टूडियो');
console.log('✓ Direct key translation works in all 3 languages');

// Test interpolation
assert.strictEqual(tEn('detectedNecrosis', { pct: 15.5 }), 'Detected Necrosis (15.5%)');
assert.strictEqual(tKn('detectedNecrosis', { pct: 15.5 }), 'ಪತ್ತೆಯಾದ ಹಾನಿ (15.5%)');
assert.strictEqual(tHi('detectedNecrosis', { pct: 15.5 }), 'पहचाना गया नुकसान (15.5%)');
console.log('✓ Interpolation works correctly across languages');

// Test fallback to English when key is missing in kn
translations.kn.__test_missing_key = undefined;
translations.en.__test_missing_key = 'English Fallback Text';
assert.strictEqual(tKn('__test_missing_key'), 'English Fallback Text');
delete translations.en.__test_missing_key;
delete translations.kn.__test_missing_key;
console.log('✓ Missing key in Kannada successfully falls back to English');

// Test fallback to provided fallback text
assert.strictEqual(tKn('non_existent_key_123', 'Default Fallback Value'), 'Default Fallback Value');
assert.strictEqual(tKn('non_existent_key_123', { x: 1 }, 'Fallback with {{x}}'), 'Fallback with 1');
assert.strictEqual(tKn('non_existent_key_123'), 'non_existent_key_123');
console.log('✓ Missing key fallback to user default and key string works');

// Test nested object handling (preventing TypeError: Cannot read properties of undefined)
translations.en.__nested = { section: { title: 'Nested Title' } };
assert.strictEqual(tKn('__nested.section.title'), 'Nested Title');
assert.strictEqual(tKn('__nested.section.missing', 'Default Nested'), 'Default Nested');
assert.strictEqual(tKn('__completely.missing.nested.path', 'Safe Fallback'), 'Safe Fallback');
delete translations.en.__nested;
console.log('✓ Nested dot notation traversal works with zero TypeError exceptions');

// Test edge cases: null, undefined, empty, number
assert.strictEqual(tEn(null), '');
assert.strictEqual(tEn(undefined), '');
assert.strictEqual(tEn(''), '');
console.log('✓ Edge cases (null, undefined, empty) handled safely without throwing');

console.log('\n--- ALL TRANSLATION TESTS PASSED ---');
