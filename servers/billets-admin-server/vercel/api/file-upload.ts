import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  } else {
    // todo: add white list url of cors
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://billets-admin.coldsurf.io'
    )
  }
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS' || req.method !== 'GET') {
    res.status(200).end()
    return
  }

  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.FSTVLLIFE_ORIGIN_KEY ?? '',
    },
  })

  const post = await createPresignedPost(s3Client, {
    Bucket: process.env.FSTVLLIFE_ORIGIN_B ?? '',
    Key: `billets/poster-thumbnails/${req.query.filename}` as string,
    Fields: {
      acl: 'public-read',
      'Content-Type': req.query.filetype as string,
    },
    Expires: 5, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576 * 10], // up to 1 MB * 10 = 10 MB
    ],
  })

  res.status(200).json(post)
}

export default handler
