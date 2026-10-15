import test from 'node:test';
import assert from 'node:assert/strict';
import { expiryStatus, saleProfit, stockStatus, toMinor } from '../dist/business.js';

test('converts rupees to integer paise without floating point drift', () => {
  assert.equal(toMinor(12.35), 1235);
  assert.equal(toMinor(0.1 + 0.2), 30);
});
test('classifies out, low, and healthy stock consistently', () => {
  assert.equal(stockStatus(0, 5), 'out');
  assert.equal(stockStatus(5, 5), 'low');
  assert.equal(stockStatus(6, 5), 'in');
});
test('identifies expired and upcoming dates and leaves nonperishable goods unmarked', () => {
  const today = new Date('2026-01-01T00:00:00Z');
  assert.equal(expiryStatus(undefined, today), 'none');
  assert.equal(expiryStatus(new Date('2025-12-31T00:00:00Z'), today), 'expired');
  assert.equal(expiryStatus(new Date('2026-01-20T00:00:00Z'), today), 'soon');
  assert.equal(expiryStatus(new Date('2026-03-01T00:00:00Z'), today), 'ok');
});
test('estimates profit after discount and product cost', () => {
  assert.equal(saleProfit(1500, 1000, 100), 400);
});
