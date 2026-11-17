import { expect, test } from '@playwright/test';

test.skip(!['linux', 'darwin'].includes(process.platform), 'Reference snapshots exist for Linux and macOS.');

for (const theme of ['tng', 'voyager']) {
  for (const viewport of [
    { width: 1440, height: 900, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
  ]) {
    test(`${theme} at ${viewport.name} size`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      if (theme === 'voyager') {
        await page.getByRole('switch', { name: 'Voyager theme' }).click();
        await expect(page.locator('lcars-screen')).toHaveAttribute('theme', 'voyager');
        await page.mouse.move(0, 0);
      }
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${theme}-${viewport.name}.png`, { fullPage: true });
    });
  }
}
