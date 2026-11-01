import { useState } from 'react'
import { ThemeContext } from './themeContext.js'

export function ThemeProvider({ children }) {
  const [fondoOscuro, setFondoOscuro] = useState(true)

  function alternarFondo() {
    setFondoOscuro((fondoActual) => !fondoActual)
  }

  return (
    <ThemeContext.Provider value={{ fondoOscuro, alternarFondo }}>
      {children}
    </ThemeContext.Provider>
  )
}
