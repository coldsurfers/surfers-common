// eslint-disable-next-line import/prefer-default-export
export function generateEmailValidationCode(): number {
  return Math.floor(100000 + Math.random() * 900000)
}
