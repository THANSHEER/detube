import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../styles/global.css'

// Inject the build-time browser identifier so CSS can apply browser-specific
// design tokens via [data-browser="..."] selectors.
document.documentElement.setAttribute('data-browser', __BROWSER__)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
