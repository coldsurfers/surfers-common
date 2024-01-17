class HttpRequest {
  private host: string =
    process.env.NODE_ENV === 'development'
      ? 'http://0.0.0.0:8008'
      : 'https://api.accounts.coldsurf.io/v1'

  // eslint-disable-next-line no-undef
  async request(path: string, init?: RequestInit) {
    return await fetch(`${this.host}${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...init,
    })
  }
}

export default HttpRequest
