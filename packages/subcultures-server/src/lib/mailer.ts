import NodeMailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const { MAILER_USER: user, MAILER_PASS: pass } = process.env

interface SendMailParams {
    to: string
    validationCode: number
}

interface SendMailReturnValue {
    messageId?: string
}

async function sendMail({
    to,
    validationCode,
}: SendMailParams): Promise<SendMailReturnValue> {
    try {
        const transporter = NodeMailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user,
                pass,
            },
        })

        const res = await transporter.sendMail({
            from: user,
            to,
            subject: 'GrungeBank 이메일 인증 코드',
            html: `
                <!DOCTYPE html>
                <html>
                    <head>
                    </head>
                    <body>
                        <p>인증코드는 아래와 같습니다</p>
                        <h1>${validationCode}</h1>
                    </body>
                </html>
            `,
        })

        return {
            messageId: res.messageId,
        }
    } catch (e) {
        console.error(e)
        return {
            messageId: undefined,
        }
    }
}

export default sendMail
