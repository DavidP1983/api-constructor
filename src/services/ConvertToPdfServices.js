import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

let browserPromise = null;

export const getBrowser = async () => {
    if (browserPromise) return browserPromise;

    try {
        const isVercel = !!process.env.VERCEL;

        if (isVercel) {
            browserPromise = puppeteerCore.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: true,
                slowMo: 50,
                timeout: 0,
            });

        } else {
            const puppeteerFull = await import('puppeteer');
            browserPromise = puppeteerFull.default.launch({
                headless: true,
                slowMo: 50,
                timeout: 0
            });
        }

        // Если launch упал — сбрасываем кеш
        browserPromise.catch(() => {
            browserPromise = null;
        });

        return await browserPromise;

    } catch (error) {
        browserPromise = null;
        throw new Error('Failed to launch browser');
    }
};