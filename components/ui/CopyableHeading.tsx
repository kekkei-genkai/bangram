'use client'

import React from 'react'

interface CopyableHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  text: {
    copy: string
    copied: string
  }
  copyValue?: string
  resetDelayMs?: number
}

export default function CopyableHeading({
  text,
  copyValue,
  resetDelayMs = 1500,
  ...rest
}: CopyableHeadingProps) {
  const handleCopy = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget
    const originalText = target.textContent
    const textToCopy =
      copyValue || window.location.origin + window.location.pathname

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          target.textContent = text.copied
          setTimeout(() => {
            target.textContent = originalText
          }, resetDelayMs)
        })
        .catch(() => {
          copyUsingInput(textToCopy, target, originalText)
        })
    } else {
      copyUsingInput(textToCopy, target, originalText)
    }

    function copyUsingInput(
      textToCopy: string,
      target: HTMLElement,
      originalText: string | null,
    ) {
      const input = document.createElement('input')
      input.style.position = 'absolute'
      input.style.left = '-9999px'
      input.value = textToCopy
      document.body.appendChild(input)
      input.select()
      input.setSelectionRange(0, input.value.length)
      const successful = document.execCommand('copy')
      document.body.removeChild(input)
      if (successful) {
        target.textContent = text.copied
        setTimeout(() => {
          target.textContent = originalText
        }, resetDelayMs)
      }
    }
  }

  return (
    <h2 className='cursor-pointer' onClick={handleCopy} {...rest}>
      {text.copy}
    </h2>
  )
}
