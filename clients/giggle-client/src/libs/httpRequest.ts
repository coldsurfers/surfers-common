const httpRequest = (path: string, init?: RequestInit) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`, init)
}

export default httpRequest
