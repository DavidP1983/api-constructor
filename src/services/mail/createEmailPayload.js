
export const createEmailPayload = (data) => {

    const mailPayLoad = {
        to: data.candidateEmail,
        name: data.candidateName,
        subject: 'Test result',
        template_id: 6374,
        template_data: {
            company_name: 'Test Constructor',
            name: data.candidateName,
            score: data.score,
            test_name: data.testName
        }
    };
    return mailPayLoad;
};