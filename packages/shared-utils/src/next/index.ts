export const createCommonCookieOptions = ({
  maxAge,
  httpOnly = true,
}: {
  maxAge: number;
  httpOnly?: boolean;
}) => {
  return {
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    maxAge,
    sameSite: 'lax',
    path: '/',
    domain: undefined,
  } as const;
};
