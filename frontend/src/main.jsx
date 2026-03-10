import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { CVProvider } from './context/CVContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <CVProvider>
                <App />
            </CVProvider>
        </AuthProvider>
    </React.StrictMode>,
)
