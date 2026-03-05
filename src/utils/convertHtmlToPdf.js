import { ApiError } from "../exceptions/apiError.js";
import { getBrowser } from "../services/ConvertToPdfServices.js";

export const convertHtmlToPdf = async (htmlData) => {

    const browser = await getBrowser();
    let page;

    try {
        page = await browser.newPage();

        await page.setContent(htmlData, { waitUntil: "networkidle0" });

        const pdfUint8 = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        const pdfBuffer = Buffer.from(pdfUint8);
        const pdfBase64 = pdfBuffer.toString("base64").replace(/\r?\n/g, "");

        return pdfBase64;

    } catch (error) {
        throw ApiError.internal(500, 'PDF generation failed, Please try again');
    } finally {
        if (page) {
            await page.close().catch(() => { });
        }
    }
};