import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../styles/global.css'

// Apply saved theme immediately before mount to prevent visual flash
try {
  const cachedTheme = localStorage.getItem('detube_theme')
  if (cachedTheme && cachedTheme !== 'system') {
    document.documentElement.setAttribute('data-theme', cachedTheme)
  }
} catch { /* ignore */ }

// Inject the build-time browser identifier so CSS can apply browser-specific
// design tokens via [data-browser="..."] selectors.
document.documentElement.setAttribute('data-browser', __BROWSER__)

// Detect if running in a standalone browser tab (e.g., options page or expanded view)
const isPopup = window.innerWidth <= 400 && window.innerHeight <= 520 && !window.location.search.includes('tab=true')
if (!isPopup && window.innerWidth > 480) {
  document.body.classList.add('is-tab-mode')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
