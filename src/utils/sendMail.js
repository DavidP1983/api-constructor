import MailServices from "../services/mailServices.js";

export const sendMail = async (data) => {
    const {
        testName,
        candidateName,
        candidateEmail,
        score
    } = data;

    if (score < 70) {
        try {
            const result = await MailServices.sendMail({
                to: candidateEmail,
                name: candidateName,
                subject: 'Test result',
                template_id: 6374,
                template_data: {
                    company_name: 'Test Constructor',
                    name: candidateName,
                    score,
                    test_name: testName
                }
            });
            return result;
        } catch (e) {
            console.error(e);
        }
    }
};