import { useState } from 'react'
import { guardarPaisesSanitizados } from './services/guardarPaisesSanitizados.js'

function App() {
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)

  async function handleGuardarPaises() {
    setGuardando(true)
    setMensaje('')
    setError(false)

    try {
      const paises = await guardarPaisesSanitizados()
      setMensaje(`Se sincronizaron ${paises.length} países en MockAPI, sin duplicados.`)
    } catch (errorGuardado) {
      setError(true)
      setMensaje(
        errorGuardado instanceof Error
          ? errorGuardado.message
          : `No se pudieron guardar los países: ${String(errorGuardado)}`,
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main>
      <h1>Países de América</h1>
      <p>Obtén los países hispanohablantes y guarda sus datos en MockAPI.</p>
      <button type="button" onClick={handleGuardarPaises} disabled={guardando}>
        {guardando ? 'Guardando países…' : 'Obtener y guardar países'}
      </button>
      {mensaje && (
        <p className={error ? 'mensaje mensaje-error' : 'mensaje'} role={error ? 'alert' : 'status'}>
          {mensaje}
        </p>
      )}
    </main>
  )
}

export default App
