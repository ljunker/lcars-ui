import { expect, test } from '@playwright/test';
import type { LcarsProgress, LcarsScreen } from 'lcars-ui';

test('inherits tokens across nested screens while each screen retains its theme', async ({ page }) => {
  await page.goto('/examples/vanilla-html/');
  await page.locator('lcars-screen').evaluate((outer: LcarsScreen) => {
    const inner = document.createElement('lcars-screen');
    inner.theme = 'voyager';
    const panel = document.createElement('lcars-panel');
    const button = document.createElement('lcars-button');
    button.textContent = 'Nested control';
    panel.append(button);
    inner.append(panel);
    outer.append(inner);
  });

  const outer = page.locator('lcars-screen').first();
  const inner = page.locator('lcars-screen lcars-screen');
  const button = page.getByRole('button', { name: 'Nested control' });
  await expect(button).toHaveCSS('background-color', 'rgb(152, 202, 255)');
  await expect(inner.locator('lcars-panel [part="frame"]')).toHaveCSS('border-top-left-radius', '20px');

  await outer.evaluate((screen) => {
    screen.style.setProperty('--lcars-color-primary', '#a0ffb0');
    screen.style.setProperty('--lcars-elbow-radius', '24px');
  });
  await expect(button).toHaveCSS('background-color', 'rgb(160, 255, 176)');
  await expect(inner.locator('lcars-panel [part="frame"]')).toHaveCSS('border-top-left-radius', '24px');

  await inner.evaluate((screen) => screen.style.setProperty('--lcars-color-primary', '#e0f5f0'));
  await expect(button).toHaveCSS('background-color', 'rgb(224, 245, 240)');
  await expect(page.getByRole('button', { name: 'Recharge' })).toHaveCSS('background-color', 'rgb(160, 255, 176)');
});

test('updates native progress semantics when values or maxima change', async ({ page }) => {
  await page.goto('/examples/vanilla-html/');
  const battery = page.getByRole('progressbar', { name: 'Battery' });
  await page.getByRole('button', { name: 'Recharge' }).click();
  await expect(battery).toHaveAttribute('value', '100');

  await page.locator('lcars-progress').evaluate((progress: LcarsProgress) => {
    progress.max = 30;
    progress.value = 75;
  });
  await expect(battery).toHaveAttribute('max', '30');
  await expect(battery).toHaveAttribute('value', '30');

  await page.getByRole('switch', { name: 'Voyager theme' }).click();
  await expect(page.locator('lcars-screen')).toHaveAttribute('theme', 'voyager');
});

test('renders controls inside React and updates values through a native change event', async ({ page }) => {
  await page.goto('/examples/react/');
  const reserve = page.getByRole('progressbar', { name: 'Reserve' });
  await expect(reserve).toHaveAttribute('value', '41');
  await page.getByRole('switch', { name: 'Transfer power' }).click();
  await expect(reserve).toHaveAttribute('value', '87');
});

test('rail and elbow dimensions adapt to tokens and viewport width', async ({ page }) => {
  await page.goto('/apps/playground/geometry.html');
  const rail = page.locator('lcars-header [part="rail"]');
  const elbow = page.locator('lcars-header [part="elbow"]');
  await expect(rail).toHaveCSS('height', '11px');
  await expect(elbow).toHaveCSS('width', '32px');
  await page.getByRole('switch', { name: 'Wide rails' }).click();
  await page.getByRole('switch', { name: 'Large elbows' }).click();
  await expect(rail).toHaveCSS('height', '20px');
  await expect(elbow).toHaveCSS('width', '48px');

  const desktopWidth = (await rail.boundingBox())!.width;
  await page.setViewportSize({ width: 420, height: 900 });
  await expect(rail).toHaveCSS('height', '20px');
  expect((await rail.boundingBox())!.width).toBeLessThan(desktopWidth);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(420);
});
