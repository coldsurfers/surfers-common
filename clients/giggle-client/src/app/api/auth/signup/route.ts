export const POST = async (request: Request) => {
  const requestBody = await request.json()
  console.log(requestBody)

  return Response.json({ hello: 'world!' })
}
