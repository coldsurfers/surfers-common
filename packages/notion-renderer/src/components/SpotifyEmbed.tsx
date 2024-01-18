'use client'

import { useState, useEffect } from 'react'

export default function SpotifyEmbed({ spotifyURL }: { spotifyURL: string }) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    const fetchSpotifyOEmbed = async () => {
      const res = await fetch(
        `https://open.spotify.com/oembed?url=${spotifyURL}`
      )
      const data = (await res.json()) as {
        html: string
      }
      setHtml(data.html)
    }
    fetchSpotifyOEmbed()
  }, [])

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}
