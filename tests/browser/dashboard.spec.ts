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
  const approach = page.getByRole('combobox', { name: 'Approach mode' });
  await expect(approach).toBeFocused();
  await expect(approach).toHaveValue('standard');
  await page.keyboard.press('Tab');
  await expect(plot).toBeFocused();
  await page.keyboard.press('Space');

  const dialog = page.getByRole('dialog', { name: 'Confirm flight plan' });
  const cancel = page.getByRole('button', { name: 'Cancel', exact: true });
  const confirm = page.getByRole('button', { name: 'Confirm course' });
  const courseMessage = page.locator('#course-message');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#course-destination')).toHaveText('Vulcan');
  await expect(page.locator('#course-approach')).toHaveText('Standard');
  await expect(courseMessage).toHaveText('NO ACTIVE COURSE');
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(confirm).toBeFocused();
  await navigation.focus();
  await expect(confirm).toBeFocused();
  await page.mouse.click(1, 1);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(plot).toBeFocused();
  await expect(courseMessage).toHaveText('NO ACTIVE COURSE');

  await page.keyboard.press('Space');
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(plot).toBeFocused();
  await expect(courseMessage).toHaveText('HEADING SET / Vulcan · standard');
  await expect(page.getByText('Course locked')).toBeVisible();

  await destination.fill('Andoria');
  await approach.selectOption('docking');
  await expect(page.getByText('Awaiting course')).toBeVisible();
  await plot.click();
  await expect(page.locator('#course-destination')).toHaveText('Andoria');
  await expect(page.locator('#course-approach')).toHaveText('Docking');
  await page.locator('#destination').evaluate((input: HTMLElementTagNameMap['lcars-input']) => {
    input.value = 'Earth';
  });
  await confirm.click();
  await expect(courseMessage).toHaveText('HEADING SET / Andoria · docking');
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

  test('opens and cancels the flight plan within a 390px viewport', async ({ page }) => {
    const viewport = { width: 390, height: 650 };
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.getByRole('button', { name: 'Navigation' }).tap();
    await page.getByRole('textbox', { name: 'Destination' }).fill('Vulcan');
    await page.getByRole('button', { name: 'Plot course' }).tap();

    const dialog = page.getByRole('dialog', { name: 'Confirm flight plan' });
    await expect(dialog).toBeVisible();
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);

    await page.getByRole('button', { name: 'Cancel', exact: true }).tap();
    await expect(dialog).toBeHidden();
    await expect(page.getByText('Awaiting course')).toBeVisible();
    await expect(page.locator('#course-message')).toHaveText('NO ACTIVE COURSE');
  });

  test('updates thrust telemetry from a touch input in the navigation view', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Navigation' }).tap();
    await expect(page.getByRole('combobox', { name: 'Approach mode' })).toBeVisible();
    const slider = page.getByRole('slider', { name: 'Maneuvering thrust' });
    const thrusters = page.getByRole('progressbar', { name: 'Maneuvering thrusters' });
    await expect(thrusters).toHaveAttribute('value', '24');
    await slider.scrollIntoViewIfNeeded();
    const bounds = (await slider.boundingBox())!;
    await slider.tap({ position: { x: Math.floor(bounds.width * 0.75), y: Math.floor(bounds.height / 2) } });
    await expect.poll(async () => Number(await thrusters.getAttribute('value'))).toBeGreaterThan(50);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });

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

    await page.getByRole('button', { name: 'Navigation' }).click();
    const navigationResult = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(navigationResult.violations).toEqual([]);

    await page.getByRole('textbox', { name: 'Destination' }).fill('Vulcan');
    await page.getByRole('button', { name: 'Plot course' }).click();
    await expect(page.getByRole('dialog', { name: 'Confirm flight plan' })).toBeVisible();
    const dialogResult = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(dialogResult.violations).toEqual([]);
  });
}
