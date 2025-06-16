'use client'

import React, { useState, useRef } from 'react'

function useTrackRef<T>(initialValue: T) {
  const ref = useRef<{ current: T; previous: T }>({
    current: initialValue,
    previous: initialValue,
  })

  const set = (value: T) => {
    ref.current.previous = ref.current.current
    ref.current.current = value
  }

  return [ref.current, set] as const
}

type InteractivePuzzleProps = React.SVGProps<SVGSVGElement>

class Piece {
  id: string
  points: string
  position: { x: number; y: number }
  angle: number
  center: { x: number; y: number }
  pointsAdjusted: string

  constructor(
    id: string,
    points: string,
    position: { x: number; y: number },
    center: { x: number; y: number } = { x: 0, y: 0 },
  ) {
    this.id = id
    this.points = points
    this.position = position
    this.center = center
    this.angle = 0
    this.pointsAdjusted = points
  }

  setAngle(angle: number) {
    this.angle = angle

    const newPointsArr = this.points.split(' ').map((pointStr) => {
      const [x, y] = pointStr.split(',').map(Number)
      const cx = this.center.x
      const cy = this.center.y
      const offsetX = x - cx
      const offsetY = y - cy
      const rotatedX =
        offsetX * Math.cos(this.angle) - offsetY * Math.sin(this.angle)
      const rotatedY =
        offsetX * Math.sin(this.angle) + offsetY * Math.cos(this.angle)
      return { x: rotatedX + cx, y: rotatedY + cy }
    })

    this.pointsAdjusted = newPointsArr.map((pt) => `${pt.x},${pt.y}`).join(' ')
  }
}

export default function InteractivePuzzle({
  ...svgProps
}: InteractivePuzzleProps) {
  const [targetPieces] = useState(() => {
    return [
      new Piece('target', '0,0 50,50 0,100', { x: 0, y: 0 }),
      new Piece('target', '0,50 50,0 50,100', { x: 50, y: 0 }),
      new Piece('target', '0,50 50,0 100,50 50,100', { x: 0, y: 50 }),
      new Piece('target', '0,0 0,150 150,150', { x: 50, y: 150 }),
      new Piece('target', '0,0 150,0 150,150', { x: 50, y: 300 }),
      new Piece('target', '0,75 75,0 150,75', { x: 50, y: 375 }),
      new Piece('target', '0,75 75,0 150,0 75,75', { x: 200, y: 375 }),
    ]
  })
  const [pieces, setPieces] = useState(() => {
    const pieces: Piece[] = []

    for (let i = 0; i < targetPieces.length; i++) {
      const pointsArr = targetPieces[i].points.split(' ').map((point) => {
        const [x, y] = point.split(',').map(Number)
        return { x, y }
      })
      const center = {
        x: pointsArr.reduce((sum, p) => sum + p.x, 0) / pointsArr.length,
        y: pointsArr.reduce((sum, p) => sum + p.y, 0) / pointsArr.length,
      }

      pieces.push(
        new Piece(
          `piece-${i}`,
          targetPieces[i].points,
          {
            x: 320 + Math.random() * 180,
            y: Math.random() * 320,
          },
          center,
        ),
      )
    }

    return pieces
  })

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mouseRef, setMouse] = useTrackRef({ x: 0, y: 0 })
  const [cursor, setCursor] = useState<string>('move')

  const updateMousePosition = (e: React.MouseEvent<SVGSVGElement>) => {
    const { width: displayWidth } = e.currentTarget.getBoundingClientRect()
    const viewBoxWidth = e.currentTarget.viewBox.baseVal.width
    const scaleRatio = viewBoxWidth / displayWidth

    const rect = e.currentTarget.getBoundingClientRect()
    const mouseOffset = {
      x: rect.left,
      y: rect.top,
    }

    setMouse({
      x: (e.clientX - mouseOffset.x) * scaleRatio,
      y: (e.clientY - mouseOffset.y) * scaleRatio,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (e.key == 'Shift' && cursor == 'move') {
      setCursor('grab')
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (e.key == 'Shift' && cursor == 'grab') {
      setCursor('move')
    } else if (e.key == 'Shift') {
      const piece = pieces.find((p) => p.id == draggingId)
      if (piece) {
        setDragOffset({
          x: mouseRef.current.x - piece.position.x,
          y: mouseRef.current.y - piece.position.y,
        })
        piece.setAngle(Math.round(piece.angle / (Math.PI / 4)) * (Math.PI / 4))
      }
    }
  }

  const handleMouseDown = (id: string, pos: { x: number; y: number }) => {
    setDraggingId(id)
    setDragOffset({
      x: mouseRef.current.x - pos.x,
      y: mouseRef.current.y - pos.y,
    })
    setCursor('grabbing')
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    updateMousePosition(e)

    if (!draggingId) return

    if (e.shiftKey) {
      const piece = pieces.find((p) => p.id === draggingId)
      if (!piece) return

      const center = {
        x: piece.position.x + piece.center.x,
        y: piece.position.y + piece.center.y,
      }
      const currentAngle = Math.atan2(
        mouseRef.current.y - center.y,
        mouseRef.current.x - center.x,
      )
      const previousAngle = Math.atan2(
        mouseRef.previous.y - center.y,
        mouseRef.previous.x - center.x,
      )
      const angleDelta = currentAngle - previousAngle

      piece.setAngle(piece.angle + angleDelta)
    } else {
      const piece = pieces.find((p) => p.id == draggingId)
      if (piece) {
        piece.position.x = mouseRef.current.x - dragOffset.x
        piece.position.y = mouseRef.current.y - dragOffset.y
      }
    }

    setPieces([...pieces])
  }

  const handleMouseUp = () => {
    const piece = pieces.find((p) => p.id == draggingId)
    if (piece) {
      const draggingVertices = piece.pointsAdjusted
        .split(' ')
        .map((pointStr) => {
          const [x, y] = pointStr.split(',').map(Number)
          return {
            x: x + piece.position.x,
            y: y + piece.position.y,
          }
        })

      outerLoop: for (const target of targetPieces) {
        const targetVertices = target.pointsAdjusted
          .split(' ')
          .map((pointStr) => {
            const [x, y] = pointStr.split(',').map(Number)
            return { x: x + target.position.x, y: y + target.position.y }
          })

        for (const dVertex of draggingVertices) {
          for (const tVertex of targetVertices) {
            const dx = dVertex.x - tVertex.x
            const dy = dVertex.y - tVertex.y
            if (Math.sqrt(dx * dx + dy * dy) < 10) {
              const deltaX = tVertex.x - dVertex.x
              const deltaY = tVertex.y - dVertex.y

              piece.position.x += deltaX
              piece.position.y += deltaY
              break outerLoop
            }
          }
        }
      }

      piece.position.x = Math.round(piece.position.x)
      piece.position.y = Math.round(piece.position.y)
      piece.setAngle(Math.round(piece.angle / (Math.PI / 4)) * (Math.PI / 4))

      let allPiecesMatched = true
      const threshold = 1
      for (const piece of pieces) {
        // Compute the vertices of the current piece, adjusted by its position
        const pieceVertices = piece.pointsAdjusted
          .split(' ')
          .map((pointStr) => {
            const [x, y] = pointStr.split(',').map(Number)
            return { x: x + piece.position.x, y: y + piece.position.y }
          })

        let pieceMatchFound = false
        for (const target of targetPieces) {
          // Compute the target vertices adjusted by target's position
          const targetVertices = target.pointsAdjusted
            .split(' ')
            .map((pointStr) => {
              const [x, y] = pointStr.split(',').map(Number)
              return { x: x + target.position.x, y: y + target.position.y }
            })

          const usedIndices = new Set<number>()
          let allMatchedForTarget = true

          // For every vertex of the target, try to find a match in piece's vertices
          for (const tVertex of targetVertices) {
            let foundMatch = false
            for (let i = 0; i < pieceVertices.length; i++) {
              if (usedIndices.has(i)) continue
              const pVertex = pieceVertices[i]
              const dx = tVertex.x - pVertex.x
              const dy = tVertex.y - pVertex.y
              if (Math.sqrt(dx * dx + dy * dy) < threshold) {
                usedIndices.add(i)
                foundMatch = true
                break
              }
            }
            if (!foundMatch) {
              allMatchedForTarget = false
              break
            }
          }

          if (allMatchedForTarget) {
            pieceMatchFound = true
            break
          }
        }

        if (!pieceMatchFound) {
          allPiecesMatched = false
          break
        }
      }

      if (allPiecesMatched) {
        setTimeout(() => {
          alert('solved!')
        }, 100)
      }
    }

    setDraggingId(null)
    setCursor('move')
  }

  return (
    <svg
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      {...svgProps}
      cursor={cursor == 'grabbing' ? 'grabbing' : 'auto'}
    >
      {targetPieces.map((piece) => (
        <polygon
          key={targetPieces.indexOf(piece)}
          points={piece.pointsAdjusted}
          fill='lightblue'
          stroke='lightblue'
          transform={`translate(${piece.position.x}, ${piece.position.y})`}
        />
      ))}
      {pieces.map((piece) => (
        <polygon
          key={piece.id}
          points={piece.pointsAdjusted}
          className='stroke-2 stroke-white'
          fill='rgba(255, 155, 0, 0.8)'
          cursor={cursor}
          transform={`translate(${piece.position.x}, ${piece.position.y})`}
          onMouseDown={() => handleMouseDown(piece.id, piece.position)}
        />
      ))}
    </svg>
  )
}
