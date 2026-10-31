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
    <>
      <main className="app-content">
        <h1>Países de América</h1>
        <div className="sync-controls">
          <button
            className="sync-button"
            type="button"
            onClick={handleGuardarPaises}
            disabled={guardando}
          >
            {guardando ? 'Guardando países…' : 'Obtener y guardar países'}
          </button>
          <p>en MockAPI.</p>
        </div>
        {mensaje && (
          <p className={error ? 'mensaje mensaje-error' : 'mensaje'} role={error ? 'alert' : 'status'}>
            {mensaje}
          </p>
        )}
      </main>
      <section className="backend-section">
        <iframe
          className="backend-frame"
          src="/api/paisesA"
          title="Interfaz backend para administrar países"
          scrolling="no"
          onLoad={(event) => {
            const frame = event.currentTarget
            const document = frame.contentDocument
            const height = Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight,
            )
            frame.style.height = `${height}px`
            document.documentElement.style.overflow = 'hidden'
            document.body.style.overflow = 'hidden'
          }}
        />
      </section>
    </>
  )
}

export default App
