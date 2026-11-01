import { useCallback, useEffect, useState } from 'react'
import { paisesApi } from '../services/paisesApi.js'
import { PaisesContext } from './paisesContext.js'

const PAIS_VACIO = {
  nombreOficial: '',
  capital: '',
  languages: '',
  borders: '',
  area: '',
  image: '',
}

function mostrarValor(valor, alternativo = '') {
  if (Array.isArray(valor)) return valor.join(', ')
  if (valor === null || valor === undefined) return alternativo
  return String(valor)
}

function obtenerIdPais(pais) {
  return pais.id ?? pais._id
}

export function PaisesProvider({ children }) {
  const [paises, setPaises] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [sincronizando, setSincronizando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [paisSeleccionado, setPaisSeleccionado] = useState(null)
  const [modoFormulario, setModoFormulario] = useState('')
  const [formulario, setFormulario] = useState(PAIS_VACIO)

  useEffect(() => {
    let activo = true

    paisesApi
      .listar()
      .then((resultado) => {
        if (activo) setPaises(resultado)
      })
      .catch((errorCarga) => {
        if (activo) setError(errorCarga.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  const iniciarCreacion = useCallback(() => {
    setPaisSeleccionado(null)
    setFormulario(PAIS_VACIO)
    setModoFormulario('crear')
    setError('')
    setMensaje('')
  }, [])

  const verDetalle = useCallback(async (id) => {
    setError('')
    setMensaje('')
    try {
      setPaisSeleccionado(await paisesApi.obtener(id))
      setModoFormulario('')
    } catch (errorDetalle) {
      setError(errorDetalle.message)
    }
  }, [])

  const iniciarEdicion = useCallback(() => {
    if (!paisSeleccionado) return

    setFormulario({
      nombreOficial: paisSeleccionado.nombreOficial || paisSeleccionado.nombreOfficial || '',
      capital: mostrarValor(paisSeleccionado.capital),
      languages: mostrarValor(paisSeleccionado.languages),
      borders: mostrarValor(paisSeleccionado.borders),
      area: paisSeleccionado.area ?? '',
      image: paisSeleccionado.image || '',
    })
    setModoFormulario('editar')
    setError('')
    setMensaje('')
  }, [paisSeleccionado])

  const cambiarCampo = useCallback((name, value) => {
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }, [])

  const cancelarFormulario = useCallback(() => {
    setModoFormulario('')
    setFormulario(PAIS_VACIO)
  }, [])

  const cerrarDetalle = useCallback(() => {
    setPaisSeleccionado(null)
    setModoFormulario('')
  }, [])

  const guardarPais = useCallback(
    async (event) => {
      event.preventDefault()
      setGuardando(true)
      setError('')
      setMensaje('')

      const datos = {
        ...formulario,
        area: Number(formulario.area),
      }

      try {
        if (modoFormulario === 'editar' && paisSeleccionado) {
          const actualizado = await paisesApi.actualizar(obtenerIdPais(paisSeleccionado), datos)
          setPaisSeleccionado(actualizado)
          setMensaje('País actualizado correctamente.')
        } else {
          setPaisSeleccionado(await paisesApi.crear(datos))
          setMensaje('País creado correctamente.')
        }

        setPaises(await paisesApi.listar())
        setModoFormulario('')
        setFormulario(PAIS_VACIO)
      } catch (errorGuardado) {
        setError(errorGuardado.message)
      } finally {
        setGuardando(false)
      }
    },
    [formulario, modoFormulario, paisSeleccionado],
  )

  const eliminarPais = useCallback(async () => {
    if (!paisSeleccionado) return

    setError('')
    setMensaje('')
    try {
      await paisesApi.eliminar(obtenerIdPais(paisSeleccionado))
      setPaises(await paisesApi.listar())
      setPaisSeleccionado(null)
      setModoFormulario('')
      setMensaje('País eliminado correctamente.')
    } catch (errorEliminacion) {
      setError(errorEliminacion.message)
    }
  }, [paisSeleccionado])

  const sincronizarPaises = useCallback(async () => {
    setSincronizando(true)
    setError('')
    setMensaje('')
    try {
      const resultado = await paisesApi.sincronizar()
      setPaises(await paisesApi.listar())
      setMensaje(`Se sincronizaron ${resultado.sincronizados} países con MockAPI.`)
    } catch (errorSincronizacion) {
      setError(errorSincronizacion.message)
    } finally {
      setSincronizando(false)
    }
  }, [])

  return (
    <PaisesContext.Provider
      value={{
        paises,
        cargando,
        guardando,
        sincronizando,
        error,
        mensaje,
        paisSeleccionado,
        modoFormulario,
        formulario,
        iniciarCreacion,
        verDetalle,
        iniciarEdicion,
        cambiarCampo,
        cancelarFormulario,
        cerrarDetalle,
        guardarPais,
        eliminarPais,
        sincronizarPaises,
      }}
    >
      {children}
    </PaisesContext.Provider>
  )
}
