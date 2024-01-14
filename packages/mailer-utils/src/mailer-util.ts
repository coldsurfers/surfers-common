import mailer from 'nodemailer'
import smtpTransport, { SmtpOptions } from 'nodemailer-smtp-transport'
import Mail from 'nodemailer/lib/mailer'

export async function sendEmail({
  to,
  from,
  text,
  subject,
  smtpOptions,
}: Pick<Mail.Options, 'to' | 'text' | 'subject' | 'from'> & {
  smtpOptions: SmtpOptions
}) {
  const transport = mailer.createTransport(smtpTransport(smtpOptions))
  const mailOptions: Mail.Options = {
    from,
    to,
    subject, // 이메일 제목
    text, // 이메일 내용
  }
  const sendEmailPromise = () =>
    new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err)
        }
        resolve(info)
      })
    })

  const res = await sendEmailPromise()
  return res
}
