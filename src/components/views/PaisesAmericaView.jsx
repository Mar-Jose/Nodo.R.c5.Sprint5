import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { usePaises } from '../../context/usePaises.js'
import { useTheme } from '../../context/useTheme.js'
import { paisesApi } from '../../services/paisesApi.js'

const PAIS_VACIO = {
  nombreOficial: '',
  capital: '',
  languages: '',
  borders: '',
  area: '',
  image: '',
}

function mostrarValor(valor, alternativo = 'Sin datos') {
  if (Array.isArray(valor)) return valor.join(', ') || alternativo
  if (valor === null || valor === undefined || valor === '') return alternativo
  return String(valor)
}

function obtenerIdPais(pais) {
  return pais.id ?? pais._id
}

function obtenerFormulario(pais) {
  return {
    nombreOficial: pais.nombreOficial || pais.nombreOfficial || '',
    capital: mostrarValor(pais.capital, ''),
    languages: mostrarValor(pais.languages, ''),
    borders: mostrarValor(pais.borders, ''),
    area: pais.area ?? '',
    image: pais.image || '',
  }
}

function PaisesAmericaView() {
  const { fondoOscuro, alternarFondo } = useTheme()
  const { error, mensaje } = usePaises()

  return (
    <main
      className={`min-h-screen px-3 py-6 sm:px-8 sm:py-8 ${fondoOscuro ? 'bg-[#111827] text-white' : 'bg-slate-50 text-slate-900'}`}
    >
      <div className="mx-auto min-w-0 max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Países de América</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="rounded-md border border-current px-4 py-2 hover:bg-white/10"
              to="/paises"
            >
              Países
            </Link>
            <button
              className="rounded-md border border-current px-4 py-2 hover:bg-white/10"
              type="button"
              aria-pressed={fondoOscuro}
              onClick={alternarFondo}
            >
              Fondo {fondoOscuro ? 'claro' : 'oscuro'}
            </button>
          </div>
        </header>

        {error && (
          <p className="mb-4 break-words rounded-md border border-red-400 bg-red-50 p-3 text-red-800" role="alert">
            {error}
          </p>
        )}
        {mensaje && (
          <p className="mb-4 break-words rounded-md border border-green-500 bg-green-50 p-3 text-green-900" role="status">
            {mensaje}
          </p>
        )}

        <Outlet />
      </div>
    </main>
  )
}

export function ListadoPaisesView() {
  const { fondoOscuro } = useTheme()
  const {
    paises,
    cargando,
    errorCarga,
    reintentarCarga,
    sincronizando,
    sincronizarPaises,
  } = usePaises()
  const panel = fondoOscuro
    ? 'border-slate-700 bg-slate-800 text-white'
    : 'border-slate-200 bg-white text-slate-900'

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          Listado{!cargando && !errorCarga ? ` (${paises.length})` : ''}
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md border border-blue-500 px-4 py-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white disabled:opacity-60"
            type="button"
            onClick={sincronizarPaises}
            disabled={sincronizando}
          >
            {sincronizando ? 'Sincronizando…' : 'Sincronizar desde fuente'}
          </button>
          <Link
            className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
            to="/paises/nuevo"
          >
            Agregar país
          </Link>
        </div>
      </div>

      {cargando ? (
        <p role="status">Cargando países…</p>
      ) : errorCarga ? (
        <div className={`rounded-lg border p-6 ${panel}`} role="alert">
          <p>No se pudo cargar el listado de países. Revisa la conexión e inténtalo nuevamente.</p>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
            type="button"
            onClick={reintentarCarga}
          >
            Reintentar
          </button>
        </div>
      ) : paises.length === 0 ? (
        <p className={`rounded-lg border p-6 ${panel}`}>No hay países para mostrar.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paises.map((pais) => {
            const id = obtenerIdPais(pais)
            const nombre = pais.nombreOficial || pais.nombreOfficial || 'País sin nombre'

            return (
              <li className={`min-w-0 rounded-lg border p-4 shadow-sm sm:p-5 ${panel}`} key={id}>
                <div className="mb-4 flex items-center gap-3">
                  {pais.image && (
                    <img
                      className="h-9 w-14 rounded border border-slate-300 object-contain"
                      src={pais.image}
                      alt={`Bandera de ${nombre}`}
                    />
                  )}
                  <h3 className="min-w-0 break-words text-lg font-bold">{nombre}</h3>
                </div>
                <p className="mb-4 text-sm opacity-80">
                  Capital: {mostrarValor(pais.capital)}
                </p>
                <Link
                  className="inline-block rounded-md border border-blue-500 px-3 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
                  to={`/paises/${encodeURIComponent(id)}`}
                >
                  Ver detalle
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export function DetallePaisView() {
  const { id } = useParams()
  return <DetallePaisContent key={id} id={id} />
}

function DetallePaisContent({ id }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { fondoOscuro } = useTheme()
  const {
    eliminarPais,
    limpiarNotificaciones,
    informarCancelacionEliminacion,
  } = usePaises()
  const [pais, setPais] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const panel = fondoOscuro
    ? 'border-slate-700 bg-slate-800 text-white'
    : 'border-slate-200 bg-white text-slate-900'

  useEffect(() => {
    let activo = true
    if (!location.state?.preservarFeedback) limpiarNotificaciones()

    paisesApi
      .obtener(id)
      .then((resultado) => {
        if (activo) setPais(resultado)
      })
      .catch((errorDetalle) => {
        if (activo) setErrorCarga(errorDetalle.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [id, limpiarNotificaciones, location.state])

  async function confirmarEliminacion() {
    const nombre = pais.nombreOficial || pais.nombreOfficial
    if (!window.confirm(`¿Eliminar ${nombre}? Esta acción no se puede deshacer.`)) {
      informarCancelacionEliminacion()
      return
    }

    try {
      await eliminarPais(id)
      navigate('/paises')
    } catch {
      // El contexto publica el error para mostrarlo en el layout.
    }
  }

  if (cargando) return <p role="status">Cargando país…</p>
  if (errorCarga) {
    return (
      <section>
        <p className="mb-4 break-words rounded-md border border-red-400 bg-red-50 p-3 text-red-800" role="alert">
          {errorCarga}
        </p>
        <Link className="text-blue-500 underline" to="/paises">Volver al listado</Link>
      </section>
    )
  }
  if (!pais) return <p role="alert">No se encontró el país solicitado.</p>

  return (
    <section
      className={`rounded-lg border p-6 shadow-sm ${panel}`}
      aria-labelledby="detalle-titulo"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold" id="detalle-titulo">
          {pais.nombreOficial || pais.nombreOfficial}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700"
            to={`/paises/${encodeURIComponent(id)}/editar`}
          >
            Editar
          </Link>
          <button
            className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
            type="button"
            onClick={confirmarEliminacion}
          >
            Eliminar
          </button>
          <Link className="rounded-md border border-current px-4 py-2" to="/paises">
            Volver al listado
          </Link>
        </div>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div><dt className="font-semibold">Capital</dt><dd>{mostrarValor(pais.capital)}</dd></div>
        <div><dt className="font-semibold">Idioma(s)</dt><dd>{mostrarValor(pais.languages)}</dd></div>
        <div><dt className="font-semibold">Países limítrofes</dt><dd>{mostrarValor(pais.borders)}</dd></div>
        <div><dt className="font-semibold">Área</dt><dd>{mostrarValor(pais.area)}</dd></div>
        <div className="sm:col-span-2"><dt className="font-semibold">URL de bandera</dt><dd className="break-all">{mostrarValor(pais.image)}</dd></div>
      </dl>
    </section>
  )
}

export function FormularioPaisView() {
  const { id } = useParams()
  return <FormularioPaisContent key={id || 'nuevo'} id={id} />
}

function FormularioPaisContent({ id }) {
  const navigate = useNavigate()
  const { fondoOscuro } = useTheme()
  const {
    guardando,
    limpiarNotificaciones,
    crearPais,
    actualizarPais,
  } = usePaises()
  const [cargandoPais, setCargandoPais] = useState(Boolean(id))
  const [errorCarga, setErrorCarga] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: PAIS_VACIO })
  const esEdicion = Boolean(id)
  const panel = fondoOscuro
    ? 'border-slate-700 bg-slate-800 text-white'
    : 'border-slate-200 bg-white text-slate-900'
  const campo =
    'mt-1 w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-slate-900'

  useEffect(() => {
    let activo = true
    limpiarNotificaciones()

    if (!id) return

    paisesApi
      .obtener(id)
      .then((pais) => {
        if (activo) reset(obtenerFormulario(pais))
      })
      .catch((errorDetalle) => {
        if (activo) setErrorCarga(errorDetalle.message)
      })
      .finally(() => {
        if (activo) setCargandoPais(false)
      })

    return () => {
      activo = false
    }
  }, [id, limpiarNotificaciones, reset])

  async function guardarPais(formulario) {
    limpiarNotificaciones()
    setErrorCarga('')
    const datos = {
      ...formulario,
      area: Number(formulario.area),
    }

    try {
      const resultado = esEdicion
        ? await actualizarPais(id, datos)
        : await crearPais(datos)
      navigate(`/paises/${encodeURIComponent(obtenerIdPais(resultado))}`, {
        state: { preservarFeedback: true },
      })
    } catch {
      // El contexto publica el error para mostrarlo en el layout.
    }
  }

  if (cargandoPais) return <p role="status">Cargando país…</p>
  if (errorCarga) {
    return (
      <section>
        <p className="mb-4 rounded-md border border-red-400 bg-red-50 p-3 text-red-800" role="alert">
          {errorCarga}
        </p>
        <Link className="text-blue-500 underline" to="/paises">Volver al listado</Link>
      </section>
    )
  }

  return (
    <section className={`rounded-lg border p-6 shadow-sm ${panel}`}>
      <h2 className="mb-5 text-2xl font-bold">
        {esEdicion ? 'Editar país' : 'Agregar país'}
      </h2>
      <form className="grid min-w-0 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(guardarPais)} noValidate>
        <label className="min-w-0 font-medium">
          Nombre oficial
          <input
            className={campo}
            aria-invalid={Boolean(errors.nombreOficial)}
            aria-describedby={errors.nombreOficial ? 'nombreOficial-error' : undefined}
            {...register('nombreOficial', {
              required: 'El nombre oficial es obligatorio.',
              validate: (valor) => valor.trim().length > 0 || 'El nombre oficial es obligatorio.',
              maxLength: { value: 90, message: 'El nombre debe tener como máximo 90 caracteres.' },
            })}
          />
          {errors.nombreOficial && <span className="mt-1 block text-sm text-red-600" id="nombreOficial-error" role="alert">{errors.nombreOficial.message}</span>}
        </label>
        <label className="min-w-0 font-medium">
          Capital
          <input
            className={campo}
            aria-invalid={Boolean(errors.capital)}
            aria-describedby={errors.capital ? 'capital-error' : undefined}
            {...register('capital', {
              required: 'La capital es obligatoria.',
              validate: (valor) => valor.trim().length > 0 || 'La capital es obligatoria.',
              maxLength: { value: 200, message: 'La capital debe tener como máximo 200 caracteres.' },
            })}
          />
          {errors.capital && <span className="mt-1 block text-sm text-red-600" id="capital-error" role="alert">{errors.capital.message}</span>}
        </label>
        <label className="min-w-0 font-medium">
          Idioma(s)
          <input
            className={campo}
            aria-invalid={Boolean(errors.languages)}
            aria-describedby={errors.languages ? 'languages-error' : undefined}
            {...register('languages', {
              required: 'El idioma es obligatorio.',
              validate: (valor) => valor.trim().length > 0 || 'El idioma es obligatorio.',
              maxLength: { value: 200, message: 'Los idiomas deben tener como máximo 200 caracteres.' },
            })}
          />
          {errors.languages && <span className="mt-1 block text-sm text-red-600" id="languages-error" role="alert">{errors.languages.message}</span>}
        </label>
        <label className="min-w-0 font-medium">
          Área (km²)
          <input
            className={campo}
            type="number"
            min="0"
            step="1"
            aria-invalid={Boolean(errors.area)}
            aria-describedby={errors.area ? 'area-error' : undefined}
            {...register('area', {
              valueAsNumber: true,
              required: 'El área es obligatoria.',
              validate: (valor) =>
                (Number.isFinite(valor) && valor >= 0 && Number.isInteger(valor)) ||
                'El área debe ser un número entero mayor o igual a cero.',
            })}
          />
          {errors.area && <span className="mt-1 block text-sm text-red-600" id="area-error" role="alert">{errors.area.message}</span>}
        </label>
        <label className="min-w-0 font-medium">
          Países limítrofes
          <input
            className={campo}
            placeholder="ARG, BRA"
            aria-invalid={Boolean(errors.borders)}
            aria-describedby={errors.borders ? 'borders-error' : undefined}
            {...register('borders', {
              validate: (valor) =>
                !valor ||
                /^([A-Z]{3})([,\s]+[A-Z]{3})*$/.test(valor) ||
                'Usa códigos de tres letras en mayúsculas, separados por coma o espacio.',
            })}
          />
          {errors.borders && <span className="mt-1 block text-sm text-red-600" id="borders-error" role="alert">{errors.borders.message}</span>}
        </label>
        <label className="min-w-0 font-medium">
          URL de bandera
          <input
            className={campo}
            type="url"
            aria-invalid={Boolean(errors.image)}
            aria-describedby={errors.image ? 'image-error' : undefined}
            {...register('image', {
              validate: (valor) => {
                if (!valor) return true
                try {
                  return Boolean(new URL(valor).protocol) || 'Ingresa una URL válida.'
                } catch {
                  return 'Ingresa una URL válida.'
                }
              },
            })}
          />
          {errors.image && <span className="mt-1 block text-sm text-red-600" id="image-error" role="alert">{errors.image.message}</span>}
        </label>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button
            className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            type="submit"
            disabled={guardando}
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
          <Link
            className="rounded-md border border-current px-5 py-2"
            to={esEdicion ? `/paises/${encodeURIComponent(id)}` : '/paises'}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default PaisesAmericaView
