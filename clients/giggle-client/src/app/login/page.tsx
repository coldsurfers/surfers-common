'use server'

import LoginForm from '@/components/LoginForm'
import { emailLogin } from '../../../actions/login'

export default async function LoginPage() {
  return <LoginForm emailLogin={emailLogin} />
}
