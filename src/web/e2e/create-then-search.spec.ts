import { test, expect } from '@playwright/test';

const E2E_UNIQUE_TOKEN = 'E2E-CREATE-SEARCH-' + Date.now();

/**
 * E2E: "Create then search" — create a game with a distinctive title,
 * then search for that title and verify the game appears in the grid.
 * (We use title because the grid displays title, not description.)
 */
test.describe('Create then search', () => {
  test('create game then search for its title shows the game', async ({ page }) => {
    await page.goto('/games/new');

    await page.getByLabel('Barcode', { exact: true }).fill('E2E-BAR-' + Date.now());
    await page.getByLabel('Title', { exact: true }).fill(E2E_UNIQUE_TOKEN);
    await page.getByLabel('Description', { exact: true }).fill('E2E test game description');
    await page.getByLabel('Platform', { exact: true }).selectOption('PC');
    await page.getByLabel('Status', { exact: true }).selectOption('Upcoming');
    await page.getByLabel('Release Date', { exact: true }).fill('2027-01-15');
    await page.getByLabel('Price', { exact: true }).fill('29.99');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(/\/games$/, { timeout: 5000 });

    await page.getByPlaceholder('Search (title, description, barcode)').fill(E2E_UNIQUE_TOKEN);
    await page.getByPlaceholder('Search (title, description, barcode)').blur();

    await expect(page.locator('table.table tbody')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(E2E_UNIQUE_TOKEN)).toBeVisible({ timeout: 10000 });
  });
});
