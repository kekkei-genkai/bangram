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
  threshold = -1,
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

      if (threshold >= 0) {
        const imageData = ctx2.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          if (avg < threshold) {
            data[i + 3] = 0
          } else {
            data[i + 3] = 255
          }
        }
        ctx2.putImageData(imageData, 0, 0)
      }
    }
  }, [src, scale, targetSize, threshold])

  return <canvas ref={canvasRef} {...canvasProps} />
}
