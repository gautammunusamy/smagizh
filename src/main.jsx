import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ContentGate from './components/ContentGate'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import { EnquiryProvider } from './context/EnquiryContext'
import { PaymentProvider } from './context/PaymentContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <EnquiryProvider>
            <PaymentProvider>
              <ContentGate>
                <App />
              </ContentGate>
            </PaymentProvider>
          </EnquiryProvider>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
