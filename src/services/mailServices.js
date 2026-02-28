import dotenv from 'dotenv';
dotenv.config();

class MailService {

    async sendMail({ to, name, subject, template_id, template_data }) {

        if (!process.env.MAILEROO_API_KEY) {
            throw new Error("MAILEROO_API_KEY is not defined");
        }
        const response = await fetch(`https://smtp.maileroo.com/api/v2/emails/template`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MAILEROO_API_KEY}`,
            },
            body: JSON.stringify({
                from: {
                    address: "no-reply@6e7580298717d9cb.maileroo.org",
                    display_name: "Test Constructor"
                },
                to: [
                    {
                        address: to,
                        display_name: name
                    }
                ],
                subject,
                template_id,
                template_data,
                tracking: true
            })
        });

        const data = await response.json().catch(() => { });

        if (!response.ok) {
            throw new Error(`Maileroo error ${response.status}: ${JSON.stringify(data)}`);
        }
        return data;
    }
}

export default new MailService();