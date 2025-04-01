const selectors = {
  last: '#app-mount > div.platform-win.theme-dark.images-dark.density-default.font-size-16.low-saturation.decorate-links.has-webkit-scrollbar.full-motion.desaturate-user-colors.visual-refresh.hardware-acceleration.visual-refresh-chat-input.custom-theme-background > div.popout__0bd4a > div.content__0bd4a > div > div.animationContainer__00972 > div > div.aboveGround__7a0c3 > div.buttonAndPoints__7a0c3 > div.default__9026a.logo_cf3f70',
  shop: '#app-mount > div.platform-win.theme-dark.images-dark.density-default.font-size-16.low-saturation.decorate-links.has-webkit-scrollbar.full-motion.desaturate-user-colors.visual-refresh.hardware-acceleration.visual-refresh-chat-input.custom-theme-background > div.popout__0bd4a > div.content__0bd4a > div > div.animationContainer__00972 > div > div.mainInteractables__7a0c3 > div.primaryShop__7a0c3.shop__4b373',
  toolbar: '#app-mount > div.platform-win.theme-dark.images-dark.density-default.font-size-16.low-saturation.decorate-links.has-webkit-scrollbar.full-motion.desaturate-user-colors.visual-refresh.hardware-acceleration.visual-refresh-chat-input.custom-theme-background > div.popout__0bd4a > div.content__0bd4a > div > div.animationContainer__00972 > div > div.mainInteractables__7a0c3 > div.toolbar__4f23e.toolbar__7a0c3 > div.shop__75ed5',
  leveling: '#app-mount > div.platform-win.theme-dark.images-dark.density-default.font-size-16.low-saturation.decorate-links.has-webkit-scrollbar.full-motion.desaturate-user-colors.visual-refresh.hardware-acceleration.visual-refresh-chat-input.custom-theme-background > div.popout__0bd4a > div.content__0bd4a > div > div.animationContainer__00972 > div > div.aboveGround__7a0c3 > div:nth-child(3) > div.leveling__8e695'
};

let isRunning = false;
let intervals = {};
let lastButtonRaf;

async function waitForElement(selector, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await new Promise(r => setTimeout(r, 500));
  }
  return null;
}

async function getButtons(selector, single = false) {
  const container = await waitForElement(selector, 5000);
  if (!container) return single ? null : [];
  const buttons = container.querySelectorAll('button, [role="button"], .button, div[class*="button"], div[tabindex]');
  const visibleButtons = Array.from(buttons).filter(btn => btn.offsetParent !== null);
  return single ? visibleButtons[0] || null : visibleButtons;
}

function clickLastButton(lastButton) {
  if (isRunning) {
    lastButton.click();
    lastButtonRaf = requestAnimationFrame(() => clickLastButton(lastButton));
  }
}

async function toggleAutoClicker() {
  if (isRunning) {
    cancelAnimationFrame(lastButtonRaf);
    Object.values(intervals).forEach(clearInterval);
    isRunning = false;
    return;
  }

  const lastButton = await waitForElement(selectors.last);
  if (!lastButton) return;

  isRunning = true;

  lastButtonRaf = requestAnimationFrame(() => clickLastButton(lastButton));

  let shopIndex = 0;
  intervals.shop = setInterval(async () => {
    const buttons = await getButtons(selectors.shop);
    if (buttons.length) buttons[shopIndex].click();
    shopIndex = (shopIndex + 1) % buttons.length;
  }, 100);

  let toolbarIndex = 0;
  intervals.toolbar = setInterval(async () => {
    const buttons = await getButtons(selectors.toolbar);
    if (buttons.length) buttons[toolbarIndex].click();
    toolbarIndex = (toolbarIndex + 1) % buttons.length;
  }, 100);

  intervals.leveling = setInterval(async () => {
    const button = await getButtons(selectors.leveling, true);
    if (button) button.click();
  }, 100);
}

toggleAutoClicker();
