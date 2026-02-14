import { test, expect } from '@playwright/test';

/**
 * E2E: "Search drives grid" — seeded data includes a known token;
 * type token into search and verify filtered results.
 * Seed data (games.seed.json) includes titles/descriptions containing "Emerald".
 */
test.describe('Search drives grid', () => {
  test('typing search term filters the grid', async ({ page }) => {
    await page.goto('/games');
    await page.getByPlaceholder('Search (title, description, barcode)').fill('Emerald');
    await page.getByPlaceholder('Search (title, description, barcode)').blur();

    await expect(page.locator('table.table tbody')).toBeVisible({ timeout: 5000 });
    const rows = page.locator('table.table tbody tr.clickable-row');
    await expect(rows.first()).toBeVisible({ timeout: 5000 });
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    const firstRowText = await rows.first().textContent();
    expect(firstRowText?.toLowerCase()).toContain('emerald');
  });
});
