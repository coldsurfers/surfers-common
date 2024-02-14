import { PresignedData } from './types'

export const presign = async ({
  filename,
  filetype,
}: {
  filename: string
  filetype: 'image/*'
}): Promise<PresignedData> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_FILE_UPLOAD_URI}?filename=${filename}&filetype=${filetype}`,
    {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
    }
  )
  const data = (await result.json()) as PresignedData

  return data
}

export const uploadToPresignedURL = async ({
  data,
  file,
}: {
  data: PresignedData
  file: File
}) => {
  const formData = new FormData()

  Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string)
  })
  await fetch(data.url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    mode: 'cors',
  })
}
