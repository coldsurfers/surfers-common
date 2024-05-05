import AuthCodeTemplate from '@/ui/EmailTemplates/AuthCodeTemplate'
import AuthSignUpService from '@/database/services/auth/signUp'
import { createErrorResult, createSuccessResult } from '@/libs/createResult'
import { sendEmail } from '@/libs/mailer'
import { render } from '@react-email/components'
import { z } from 'zod'
import {
  ApiPostAuthVerificationErrorCode,
  ApiPostAuthVerificationRequestBodySchema,
} from './types'

export const POST = async (req: Request): Promise<Response> => {
  try {
    const requestBody = await req.json()
    const validation =
      ApiPostAuthVerificationRequestBodySchema.safeParse(requestBody)
    if (!validation.success) {
      return Response.json(
        createErrorResult<ApiPostAuthVerificationErrorCode>('INVALID_BODY')
      )
    }
    const { emailTo } = validation.data
    const emailVerificationResult =
      await AuthSignUpService.createOrUpdateSignUpEmailVerification(emailTo)
    if (emailVerificationResult.isError) {
      return Response.json(createErrorResult(emailVerificationResult.error))
    }

    const { authcode } = emailVerificationResult.data

    const emailHtml = render(<AuthCodeTemplate validationCode={authcode} />)
    await sendEmail({
      html: emailHtml,
      from: process.env.MAILER_EMAIL_ADDRESS,
      subject: `ColdSurf Sign Up Validation Code`,
      to: emailTo,
      smtpOptions: {
        service: process.env.MAILER_SERVICE,
        auth: {
          user: process.env.MAILER_EMAIL_ADDRESS,
          pass: process.env.MAILER_EMAIL_APP_PASSWORD,
        },
      },
    })

    return Response.json(createSuccessResult(authcode))
  } catch (e) {
    return Response.json(
      createErrorResult<ApiPostAuthVerificationErrorCode>('UNKNOWN_ERROR')
    )
  }
}
