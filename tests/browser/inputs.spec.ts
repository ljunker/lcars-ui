import { expect, test, type Page } from '@playwright/test';

async function mountInput(page: Page, tag: 'lcars-select' | 'lcars-slider', markup: string) {
  await page.goto('/examples/vanilla-html/');
  await page.locator('lcars-screen').evaluate((screen, { tag, markup }) => {
    screen.insertAdjacentHTML('beforeend', markup);
    const control = screen.querySelector(tag)!;
    const events: string[] = [];
    for (const type of ['input', 'change']) {
      screen.addEventListener(type, (event) => {
        if (event.target !== control) return;
        events.push(`${event.type}:${control.value}:${event.bubbles}/${event.composed}`);
        control.dataset.events = events.join(',');
      });
    }
  }, { tag, markup });
  return page.locator(tag);
}

test('supports native selection, keyboard events and live option markup', async ({ page }) => {
  const host = await mountInput(page, 'lcars-select', `
    <lcars-select label="Flight mode">
      <option value="">Choose a mode</option>
      <optgroup label="Flight">
        <option value="standard" selected>Standard</option>
        <option value="docking">Docking</option>
      </optgroup>
      <optgroup label="Unavailable" disabled><option>Warp</option></optgroup>
    </lcars-select>
  `);
  const select = page.getByRole('combobox', { name: 'Flight mode' });
  await expect(select).toHaveValue('standard');
  await expect(select.getByRole('option', { name: 'Warp' })).toBeDisabled();

  await host.evaluate((element: HTMLElementTagNameMap['lcars-select']) => { element.value = ''; });
  await expect(select).toHaveJSProperty('selectedIndex', 0);
  await host.evaluate((element) => { element.setAttribute('value', 'docking'); });
  await expect(select).toHaveValue('docking');
  await host.evaluate((element) => { element.removeAttribute('value'); });
  await expect(select).toHaveValue('standard');
  await expect(host).not.toHaveAttribute('data-events');

  await select.focus();
  await expect(select).toBeFocused();
  await expect(select).toHaveCSS('outline-style', 'solid');
  await select.press('d');
  await expect(select).toHaveValue('docking');
  const events = 'input:docking:true/true,change:docking:true/true';
  await expect(host).toHaveAttribute('data-events', events);

  await host.evaluate((element) => { element.querySelector('option[value="docking"]')!.remove(); });
  await expect(select).toHaveJSProperty('selectedIndex', -1);
  await expect(host).toHaveJSProperty('value', '');
  await host.evaluate((element) => {
    element.querySelector('optgroup')!.append(new Option('Docking approach', 'docking'));
  });
  await expect(select).toHaveValue('docking');
  await host.evaluate((element) => {
    element.querySelector('option[value="docking"]')!.firstChild!.textContent = 'Final approach';
  });
  await expect(select.getByRole('option', { name: 'Final approach' })).toHaveCount(1);
  await expect(select).toBeFocused();

  await host.evaluate((element: HTMLElementTagNameMap['lcars-select']) => { element.disabled = true; });
  await expect(select).toBeDisabled();
  await expect(host).toHaveAttribute('data-events', events);
});

test('uses native range normalization and exposes the live value and events', async ({ page }) => {
  const host = await mountInput(page, 'lcars-slider', `
    <lcars-slider label="Thruster power" min="20" max="80" step="10"></lcars-slider>
  `);
  const slider = page.getByRole('slider', { name: 'Thruster power' });
  const readout = host.locator('[part="readout"]');
  await expect(host).toHaveJSProperty('value', 50);
  await expect(readout).toHaveText('50');
  await slider.focus();
  await expect(slider).toBeFocused();
  await expect(slider).toHaveCSS('outline-style', 'solid');
  await slider.press('ArrowRight');
  await expect(host).toHaveJSProperty('value', 60);
  await expect(readout).toHaveText('60');
  const events = 'input:60:true/true,change:60:true/true';
  await expect(host).toHaveAttribute('data-events', events);

  await host.evaluate((element: HTMLElementTagNameMap['lcars-slider']) => { element.value = 35; });
  await expect(slider).toHaveValue('40');
  await expect(host).toHaveJSProperty('value', 40);
  await host.evaluate((element: HTMLElementTagNameMap['lcars-slider']) => {
    element.min = 1;
    element.max = 39;
    element.step = 4;
  });
  await expect(slider).toHaveValue('37');
  await expect(readout).toHaveText('37');

  await host.evaluate((element) => {
    element.setAttribute('step', 'any');
    element.setAttribute('value', '12.125');
  });
  await expect(host).toHaveJSProperty('value', 12.125);
  await expect(readout).toHaveText('12.125');
  await host.evaluate((element: HTMLElementTagNameMap['lcars-slider']) => { element.disabled = true; });
  await expect(slider).toBeDisabled();
  await expect(host).toHaveAttribute('data-events', events);
});
