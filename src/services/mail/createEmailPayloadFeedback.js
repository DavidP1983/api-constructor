
export const createEmailPayloadFeedback = (data) => {

    const rate_stars = '★'.repeat(Number(data.rate)) + '☆'.repeat(5 - Number(data.rate));

    const mailPayLoad = {
        to: 'dav.mtr83@gmail.com',
        name: data.name,
        subject: 'Feedback from user',
        template_id: 6572,
        template_data: {
            company_name: 'Test Constructor',
            name: data.name,
            who: data.who,
            ux: data.ux,
            speed: data.speed,
            rate_stars,
            text: data.text
        }
    };
    return mailPayLoad;
};
