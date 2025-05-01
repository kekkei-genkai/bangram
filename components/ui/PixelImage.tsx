'use client'

import { useEffect, useRef } from 'react'

type PixelImageProps = {
  src: string
  scale?: number
  targetSize?: number
  threshold?: number
} & React.CanvasHTMLAttributes<HTMLCanvasElement>

export default function PixelImage({
  src,
  scale = 4,
  targetSize = 64,
  threshold = 128,
  ...canvasProps
}: PixelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      let width = targetSize,
        height = targetSize

      if (img.width > img.height) {
        width = targetSize
        height = (img.height / img.width) * targetSize
      } else if (img.width < img.height) {
        height = targetSize
        width = (img.width / img.height) * targetSize
      }

      const offscreen = document.createElement('canvas')
      offscreen.width = width / scale
      offscreen.height = height / scale
      const ctx1 = offscreen.getContext('2d')
      if (!ctx1) return

      ctx1.imageSmoothingEnabled = true
      ctx1.drawImage(
        img,
        0,
        0,
        Math.floor(width / scale),
        Math.floor(height / scale),
      )

      canvas.width = width
      canvas.height = height
      const ctx2 = canvas.getContext('2d')
      if (!ctx2) return

      ctx2.imageSmoothingEnabled = false
      ctx2.drawImage(
        offscreen,
        0,
        0,
        Math.floor(width / scale),
        Math.floor(height / scale),
        0,
        0,
        canvas.width,
        canvas.height,
      )
    }
  }, [src, scale, targetSize, threshold])

  return <canvas ref={canvasRef} {...canvasProps} />
}
