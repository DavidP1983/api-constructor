import { ApiError } from "../exceptions/apiError.js";
import { createEmailPayload } from "../services/mail/createEmailPayload.js";
import { createEmailPayloadFeedback } from "../services/mail/createEmailPayloadFeedback.js";
import { createEmailPayloadWithAttachments } from "../services/mail/createEmailPayloadWithAttachments.js";
import MailServices from "../services/mail/mailServices.js";

export const sendMail = async (data, pdfBase64) => {

    if (data?.score < 70 && data?.source !== 'client') {
        try {
            const templateWithFailed = createEmailPayload(data);
            const result = await MailServices.sendMail(templateWithFailed);
            return result;
        } catch (e) {
            console.error('Background email failed:', e);
            return null;
        }
    }

    if (data?.source === 'client') {
        const templateWithSuccess = createEmailPayloadWithAttachments(data, pdfBase64);
        try {
            const result = await MailServices.sendMail(templateWithSuccess);
            return result;
        } catch (e) {
            throw ApiError.internal(500, 'Failed to send email');
        }
    }

    if (data?.source === 'feedback') {
        const templateFeedBack = createEmailPayloadFeedback(data);
        try {
            const result = await MailServices.sendMail(templateFeedBack);
            return result;
        } catch (e) {
            throw ApiError.internal(500, 'Failed to send email');
        }

    }
    throw new Error('No email condition matched');
};