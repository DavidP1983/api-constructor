import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";

let browserPromise = null;

export const getBrowser = async () => {
    if (browserPromise) return browserPromise;

    try {
        const isVercel = !!process.env.VERCEL;

        if (isVercel) {
            browserPromise = puppeteerCore.launch({
                args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: true,
                slowMo: 50,
                timeout: 0,
            });

        } else {
            browserPromise = puppeteer.launch({
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