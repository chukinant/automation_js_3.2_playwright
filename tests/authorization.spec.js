import {email, password} from '../user.js';
import {test, expect} from '@playwright/test';

test.describe('authorization tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://netology.ru/');
        await page.locator('a[href="https://netology.ru/?modal=sign_in"]').click();
    });

    test.afterEach(async ({page}) => {
        const achievementsButton = page.locator('[data-testid="programs-achievements-btn"]');
        try {
            const isLoggedIn = await achievementsButton.isVisible();
            if (isLoggedIn) {
                await page.locator('[data-testid="menu-userface"]').click();
                await page.locator('button[text="Выйти"]').click();
            }
        } catch (e) {
            console.log('Logging out is not needed or failed:', e.message);
        }
    });

    test('successful authorization', async ({page}) => {
        await page.locator('[type="email"][placeholder="Email"]').fill(email);
        await page.locator('[type="password"]').fill(password);
        await page.locator('button[data-testid="login-submit-btn"]').click();

        await expect(page.locator('//h2[contains(@class,"src-components-pages-Profile-Programs--title")]'))
        .toBeVisible({timeout: 10000})
        .toHaveText('Моё обучение');
    });

    test('user should be unauthorized', async ({page}) => {
        await page.locator('[type="email"][placeholder="Email"]').fill(email);
        await page.locator('[type="password"]').fill('invalid123');
        await page.locator('button[data-testid="login-submit-btn"]').click();

        await expect(page.locator('[data-testid="login-error-hint"]')).toBeVisible();
    });
});