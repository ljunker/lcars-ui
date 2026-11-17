import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('keyboard navigation, focus, disabled controls and course plotting', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const overview = page.getByRole('button', { name: 'Overview' });
  await expect(overview).toBeFocused();
  await expect(overview).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const navigation = page.getByRole('button', { name: 'Navigation', exact: true });
  await expect(navigation).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Navigation', level: 1 })).toBeVisible();
  await expect(navigation).toHaveAttribute('aria-current', 'true');

  const plot = page.getByRole('button', { name: 'Plot course' });
  await expect(plot).toBeDisabled();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const destination = page.getByRole('textbox', { name: 'Destination' });
  await expect(destination).toBeFocused();
  await expect(destination).toHaveCSS('outline-style', 'solid');
  await page.keyboard.type('Vulcan');
  await expect(plot).toBeEnabled();
  await page.keyboard.press('Tab');
  await expect(plot).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByText('HEADING SET / VULCAN', { exact: false })).toBeVisible();
  await expect(page.getByText('Course locked')).toBeVisible();
});

test('dashboard controls update telemetry and expose native events', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Equalize core' }).click();
  await expect(page.getByRole('progressbar', { name: 'Warp core output' })).toHaveAttribute('value', '80');
  await expect(page.getByText('CORE EQUALIZED')).toBeVisible();

  await page.getByRole('button', { name: 'Run scan' }).click();
  await expect(page.getByRole('img', { name: /Three contacts/ })).toBeVisible();
  await expect(page.getByText('3 CONTACTS TRACKED')).toBeVisible();

  const frequency = page.getByRole('textbox', { name: 'Hailing frequency' });
  await page.locator('#frequency').evaluate((input) => {
    for (const type of ['input', 'change']) {
      input.addEventListener(type, (event) => {
        input.setAttribute(`data-${type}`, `${event.target === input}/${event.bubbles}/${event.composed}`);
      });
    }
  });
  await frequency.fill('');
  const hail = page.getByRole('button', { name: 'Open channel' });
  await expect(hail).toBeDisabled();
  await frequency.fill('UFP-07');
  await hail.click();
  await expect(page.getByText('CHANNEL UFP-07 OPEN')).toBeVisible();
  await expect(page.locator('#frequency')).toHaveAttribute('data-input', 'true/true/true');
  await expect(page.locator('#frequency')).toHaveAttribute('data-change', 'true/true/true');

  await page.getByRole('button', { name: 'Engineering' }).click();
  const transfer = page.getByRole('switch', { name: 'Route power to auxiliary reserve' });
  await transfer.focus();
  await page.keyboard.press('Space');
  await expect(transfer).toBeChecked();
  await expect(page.getByRole('progressbar', { name: 'Auxiliary reserve' })).toHaveAttribute('value', '68');
});

test.describe('touch layouts', () => {
  test.use({ hasTouch: true });

  for (const width of [768, 390]) {
    test(`reflows navigation and panels without overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const sidebar = page.getByRole('navigation');
      const main = page.getByRole('main');
      await expect(sidebar).toBeVisible();
      await expect(main).toBeVisible();
      const sidebarBox = (await sidebar.boundingBox())!;
      const mainBox = (await main.boundingBox())!;
      expect(sidebarBox.y + sidebarBox.height).toBeLessThan(mainBox.y);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await page.getByRole('switch', { name: 'Voyager theme' }).tap();
      await expect(page.locator('lcars-screen')).toHaveAttribute('theme', 'voyager');
      await page.getByRole('button', { name: 'Run scan' }).tap();
      await expect(page.getByText('3 CONTACTS TRACKED')).toBeVisible();
    });
  }
});

for (const theme of ['tng', 'voyager']) {
  test(`passes automated accessibility checks in ${theme}`, async ({ page }) => {
    await page.goto('/');
    if (theme === 'voyager') await page.getByRole('switch', { name: 'Voyager theme' }).click();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
  });
}
