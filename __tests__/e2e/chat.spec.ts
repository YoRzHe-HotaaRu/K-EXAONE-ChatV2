import { test, expect } from '@playwright/test';

test.describe('K-EXAONE Chat Application', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage to start fresh
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test.describe('Initial Load', () => {
        test('displays welcome screen on first visit', async ({ page }) => {
            await page.goto('/');
            await expect(page.getByTestId('welcome-screen')).toBeVisible();
        });

        test('shows K-EXAONE logo and title', async ({ page }) => {
            await page.goto('/');
            await expect(page.getByRole('heading', { name: /K-EXAONE/i })).toBeVisible();
        });

        test('displays suggestion cards', async ({ page }) => {
            await page.goto('/');
            await expect(page.getByTestId('suggestion-0')).toBeVisible();
            await expect(page.getByTestId('suggestion-1')).toBeVisible();
            await expect(page.getByTestId('suggestion-2')).toBeVisible();
            await expect(page.getByTestId('suggestion-3')).toBeVisible();
        });

        test('has visible chat input', async ({ page }) => {
            await page.goto('/');
            await expect(page.getByTestId('chat-input')).toBeVisible();
        });
    });

    test.describe('Sidebar', () => {
        test('sidebar is visible by default', async ({ page }) => {
            await page.goto('/');
            await expect(page.getByTestId('sidebar')).toBeVisible();
        });

        test('can collapse sidebar', async ({ page }) => {
            await page.goto('/');
            await page.getByRole('button', { name: 'Close sidebar' }).click();
            await expect(page.getByTestId('sidebar')).not.toBeVisible();
        });

        test('can reopen sidebar', async ({ page }) => {
            await page.goto('/');
            await page.getByRole('button', { name: 'Close sidebar' }).click();
            await expect(page.getByTestId('open-sidebar-button')).toBeVisible();
            await page.getByTestId('open-sidebar-button').click();
            await expect(page.getByTestId('sidebar')).toBeVisible();
        });

        test('New Chat button creates new conversation', async ({ page }) => {
            await page.goto('/');
            await page.getByTestId('new-chat-button').click();
            // Should still show welcome since no messages yet
            await expect(page.getByTestId('welcome-screen')).toBeVisible();
        });
    });

    test.describe('Theme Toggle', () => {
        test('can toggle to dark mode', async ({ page }) => {
            await page.goto('/');

            // Click theme toggle
            await page.getByTestId('theme-toggle').click();

            // Check that dark mode is applied
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        });

        test('can toggle back to light mode', async ({ page }) => {
            await page.goto('/');

            // Toggle to dark
            await page.getByTestId('theme-toggle').click();
            // Toggle back to light
            await page.getByTestId('theme-toggle').click();

            await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        });

        test('theme preference persists across page reload', async ({ page }) => {
            await page.goto('/');

            // Toggle to dark
            await page.getByTestId('theme-toggle').click();

            // Reload page
            await page.reload();

            // Should still be dark
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        });
    });

    test.describe('Chat Input', () => {
        test('can type in chat input', async ({ page }) => {
            await page.goto('/');

            const input = page.getByTestId('chat-input');
            await input.fill('Hello, K-EXAONE!');

            await expect(input).toHaveValue('Hello, K-EXAONE!');
        });

        test('shows character count when typing', async ({ page }) => {
            await page.goto('/');

            const input = page.getByTestId('chat-input');
            await input.fill('Hello');

            await expect(page.getByText('5 characters')).toBeVisible();
        });

        test('send button is disabled when input is empty', async ({ page }) => {
            await page.goto('/');

            const sendButton = page.getByTestId('send-button');
            await expect(sendButton).toBeDisabled();
        });

        test('send button is enabled when input has content', async ({ page }) => {
            await page.goto('/');

            const input = page.getByTestId('chat-input');
            await input.fill('Hello');

            const sendButton = page.getByTestId('send-button');
            await expect(sendButton).toBeEnabled();
        });
    });

    test.describe('Suggestion Cards', () => {
        test('clicking suggestion sends message', async ({ page }) => {
            await page.goto('/');

            // Click first suggestion
            const suggestion = page.getByTestId('suggestion-0');
            await suggestion.click();

            // Should show message list instead of welcome
            await expect(page.getByTestId('message-list')).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Accessibility', () => {
        test('chat input has proper label', async ({ page }) => {
            await page.goto('/');

            const input = page.getByLabel('Message input');
            await expect(input).toBeVisible();
        });

        test('send button has proper label', async ({ page }) => {
            await page.goto('/');

            const button = page.getByLabel('Send message');
            await expect(button).toBeVisible();
        });

        test('sidebar toggle has proper label', async ({ page }) => {
            await page.goto('/');

            const button = page.getByLabel('Close sidebar');
            await expect(button).toBeVisible();
        });
    });

    test.describe('Responsive Design', () => {
        test('works on mobile viewport', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            // Core elements should be visible
            await expect(page.getByTestId('chat-input')).toBeVisible();
            await expect(page.getByTestId('welcome-screen')).toBeVisible();
        });

        test('works on tablet viewport', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/');

            await expect(page.getByTestId('chat-input')).toBeVisible();
            await expect(page.getByTestId('welcome-screen')).toBeVisible();
        });
    });
});
