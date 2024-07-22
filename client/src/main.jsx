import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {NextUIProvider} from '@nextui-org/react'
import { BrowserRouter as Router } from "react-router-dom";
import { ChatProvider } from './contexts/ChatContext.jsx'
import { SocketProvider } from './contexts/SocketContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <ChatProvider>
      <SocketProvider>
      <Router>
        <App />
      </Router>
      </SocketProvider>
      </ChatProvider>
    </NextUIProvider>
  </React.StrictMode>,
)
