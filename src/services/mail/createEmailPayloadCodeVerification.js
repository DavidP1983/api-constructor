
export const createEmailPayloadCodeVerification = (data) => {

    const mailPayLoad = {
        to: data.email,
        subject: 'Code Verification',
        template_id: 7060,
        template_data: {
            company_name: 'Test Constructor',
            verification_code: data.code,
        }
    };
    return mailPayLoad;
};