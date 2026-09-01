import { useRef, useState } from 'react'
import { Box, Button } from '@mui/material'

const SignaturePad = ({ onSave }: { onSave: (data: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e, canvas)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDraw = () => {
    setDrawing(false)
  }

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = canvas.toDataURL('image/png')
    onSave(data)
  }

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ border: '1px solid #ccc', borderRadius: 4, width: '100%' }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button size="small" variant="outlined" onClick={handleClear}>Borrar</Button>
        <Button size="small" variant="contained" onClick={handleSave}>Guardar firma</Button>
      </Box>
    </Box>
  )
}

export default SignaturePad