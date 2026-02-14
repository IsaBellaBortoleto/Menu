import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Index from './pages/Index'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'

// Code Splitting: Lazy load heavy pages (Admin, CustomerOrders)
// Reduz bundle inicial em ~40KB
const Admin = React.lazy(() => import('./pages/Admin'))
const CustomerOrders = React.lazy(() => import('./pages/CustomerOrders'))

// Loading skeleton component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pedidos" element={<CustomerOrders />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  </React.StrictMode>,
)
