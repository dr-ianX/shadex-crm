import { useState, useRef } from 'react'
import {
  Box,
  Button,
  LinearProgress,
} from '@mui/material'
import { CloudUpload as UploadIcon } from '@mui/icons-material'

interface FileUploadProps {
  onUpload: (urls: string[]) => void
  multiple?: boolean
}

const FileUpload = ({ onUpload, multiple = false }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    const url = multiple ? '/api/v1/upload/multiple' : '/api/v1/upload'
    if (multiple) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
    } else {
      formData.append('file', files[0])
    }

    setUploading(true)
    setProgress(30)
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      })
      setProgress(80)
      const data = await res.json()
      if (data.success) {
        const urls = multiple ? data.data.map((f: any) => f.url) : [data.data.url]
        onUpload(urls)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setProgress(100)
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 500)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <Box>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple={multiple}
        accept="image/*,application/pdf"
      />
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Subiendo...' : multiple ? 'Subir archivos' : 'Subir archivo'}
      </Button>
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </Box>
  )
}

export default FileUpload