import axios from 'axios'

// Base API client — Vite proxy handles /api/* → localhost:8080
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ═══ Response Interceptor: Handle auth errors globally ═══
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and redirect to login
      sessionStorage.removeItem('lms_token')
      sessionStorage.removeItem('lms_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ═══ Helper: Upload file (Excel bulk upload) ═══
export function uploadFile(url: string, file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData()
  formData.append('file', file)

  return apiClient.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total))
      }
    },
  })
}

// ═══ Helper: Download file (Excel export) ═══
export function downloadFile(url: string, filename: string) {
  return apiClient.get(url, { responseType: 'blob' }).then((response) => {
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  })
}
