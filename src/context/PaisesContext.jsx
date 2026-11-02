import { useCallback, useEffect, useState } from 'react'
import { paisesApi } from '../services/paisesApi.js'
import { PaisesContext } from './paisesContext.js'

function obtenerIdPais(pais) {
  return pais.id ?? pais._id
}

function mismoIdPais(pais, id) {
  const idPais = obtenerIdPais(pais)
  return idPais !== undefined && String(idPais) === String(id)
}

export function PaisesProvider({ children }) {
  const [paises, setPaises] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [sincronizando, setSincronizando] = useState(false)
  const [error, setError] = useState('')
  const [errorCarga, setErrorCarga] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let activo = true

    paisesApi
      .listar()
      .then((resultado) => {
        if (activo) {
          setPaises(resultado)
          setErrorCarga('')
        }
      })
      .catch((errorCarga) => {
        if (activo) {
          setError(errorCarga.message)
          setErrorCarga(errorCarga.message)
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  const reintentarCarga = useCallback(async () => {
    setCargando(true)
    setError('')
    setErrorCarga('')
    try {
      setPaises(await paisesApi.listar())
    } catch (errorCargaPaises) {
      setError(errorCargaPaises.message)
      setErrorCarga(errorCargaPaises.message)
    } finally {
      setCargando(false)
    }
  }, [])

  const limpiarNotificaciones = useCallback(() => {
    setError('')
    setMensaje('')
  }, [])

  const refrescarListado = useCallback(async (mensajeError) => {
    try {
      setPaises(await paisesApi.listar())
      setErrorCarga('')
    } catch (errorRefresco) {
      setError(`${mensajeError} ${errorRefresco.message}`)
    }
  }, [])

  const informarCancelacionEliminacion = useCallback(() => {
    setError('')
    setMensaje('Eliminación cancelada. No se realizaron cambios.')
  }, [])

  const crearPais = useCallback(async (datos) => {
    setGuardando(true)
    setError('')
    setMensaje('')
    let creado
    try {
      creado = await paisesApi.crear(datos)
    } catch (errorCreacion) {
      setError(errorCreacion.message)
      throw errorCreacion
    } finally {
      setGuardando(false)
    }
    setPaises((actuales) => {
      const idCreado = obtenerIdPais(creado)
      if (idCreado == null) return actuales
      return [...actuales.filter((pais) => !mismoIdPais(pais, idCreado)), creado]
    })
    setMensaje('País creado correctamente.')
    await refrescarListado(
      'El país se creó correctamente, pero no se pudo actualizar el listado.',
    )
    return creado
  }, [refrescarListado])

  const actualizarPais = useCallback(async (id, datos) => {
    setGuardando(true)
    setError('')
    setMensaje('')
    let actualizado
    try {
      actualizado = await paisesApi.actualizar(id, datos)
    } catch (errorActualizacion) {
      setError(errorActualizacion.message)
      throw errorActualizacion
    } finally {
      setGuardando(false)
    }
    const paisActualizado = {
      ...actualizado,
      id: obtenerIdPais(actualizado) ?? id,
    }
    setPaises((actuales) =>
      actuales.map((pais) => (mismoIdPais(pais, id) ? paisActualizado : pais)),
    )
    setMensaje('País actualizado correctamente.')
    await refrescarListado(
      'El país se actualizó correctamente, pero no se pudo actualizar el listado.',
    )
    return paisActualizado
  }, [refrescarListado])

  const eliminarPais = useCallback(async (id) => {
    setError('')
    setMensaje('')
    try {
      await paisesApi.eliminar(id)
    } catch (errorEliminacion) {
      setError(errorEliminacion.message)
      throw errorEliminacion
    }
    setPaises((actuales) => actuales.filter((pais) => !mismoIdPais(pais, id)))
    setMensaje('País eliminado correctamente.')
    await refrescarListado(
      'El país se eliminó correctamente, pero no se pudo actualizar el listado.',
    )
  }, [refrescarListado])

  const sincronizarPaises = useCallback(async () => {
    setSincronizando(true)
    setError('')
    setMensaje('')
    let resultado
    try {
      resultado = await paisesApi.sincronizar()
    } catch (errorSincronizacion) {
      setError(errorSincronizacion.message)
    } finally {
      setSincronizando(false)
    }
    if (!resultado) return

    setMensaje(`Se sincronizaron ${resultado.sincronizados} países con MockAPI.`)
    await refrescarListado(
      'La sincronización terminó, pero no se pudo actualizar el listado.',
    )
  }, [refrescarListado])

  return (
    <PaisesContext.Provider
      value={{
        paises,
        cargando,
        guardando,
        sincronizando,
        error,
        errorCarga,
        mensaje,
        reintentarCarga,
        limpiarNotificaciones,
        informarCancelacionEliminacion,
        crearPais,
        actualizarPais,
        eliminarPais,
        sincronizarPaises,
      }}
    >
      {children}
    </PaisesContext.Provider>
  )
}
