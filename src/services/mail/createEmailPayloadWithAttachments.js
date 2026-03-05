
export const createEmailPayloadWithAttachments = (data, pdfBase64) => {

    const mailPayload = {
        to: data.email,
        name: data.name,
        subject: 'Test result',
        template_id: 6425,
        template_data: {
            company_name: 'Test Constructor',
            subscriber_name: data.name,
            text_desc: data.text,
            test_name: data.testName,
        }
    };

    if (pdfBase64) {
        mailPayload.attachments = [
            {
                file_name: `${data.testName}-result.pdf`,
                content_type: "application/pdf",
                content: pdfBase64,
            }
        ];
    }

    return mailPayload;
};