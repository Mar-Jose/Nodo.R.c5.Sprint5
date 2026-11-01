import { useContext } from 'react'
import { PaisesContext } from './paisesContext.js'

export function usePaises() {
  const context = useContext(PaisesContext)
  if (!context) {
    throw new Error('usePaises debe usarse dentro de PaisesProvider.')
  }

  return context
}
