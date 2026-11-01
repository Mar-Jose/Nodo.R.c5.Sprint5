import { useTheme } from '../../context/useTheme.js'
import { usePaises } from '../../context/usePaises.js'

function mostrarValor(valor, alternativo = 'Sin datos') {
  if (Array.isArray(valor)) return valor.join(', ') || alternativo
  if (valor === null || valor === undefined || valor === '') return alternativo
  return String(valor)
}

function obtenerIdPais(pais) {
  return pais.id ?? pais._id
}

function PaisesAmericaView() {
  const { fondoOscuro, alternarFondo } = useTheme()
  const {
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
  } = usePaises()

  function confirmarEliminacion() {
    const nombre = paisSeleccionado.nombreOficial || paisSeleccionado.nombreOfficial
    if (window.confirm(`¿Eliminar ${nombre}? Esta acción no se puede deshacer.`)) {
      eliminarPais()
    }
  }

  const panel = fondoOscuro
    ? 'border-slate-700 bg-slate-800 text-white'
    : 'border-slate-200 bg-white text-slate-900'
  const campo =
    'mt-1 w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-slate-900'

  return (
    <main
      className={`min-h-screen px-4 py-8 sm:px-8 ${fondoOscuro ? 'bg-[#111827] text-white' : 'bg-slate-50 text-slate-900'}`}
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-400">
              React + Express + MockAPI
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Países de América</h1>
            <p className="mt-2 text-sm opacity-80">
              Administra los registros guardados en MockAPI.
            </p>
          </div>
          <button
            className="rounded-md border border-current px-4 py-2 hover:bg-white/10"
            type="button"
            aria-pressed={fondoOscuro}
            onClick={alternarFondo}
          >
            Fondo {fondoOscuro ? 'claro' : 'oscuro'}
          </button>
        </header>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Listado ({paises.length})</h2>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-md border border-blue-500 px-4 py-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white disabled:opacity-60"
              type="button"
              onClick={sincronizarPaises}
              disabled={sincronizando}
            >
              {sincronizando ? 'Sincronizando…' : 'Sincronizar desde fuente'}
            </button>
            <button
              className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
              type="button"
              onClick={iniciarCreacion}
            >
              Agregar país
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-md border border-red-400 bg-red-50 p-3 text-red-800" role="alert">
            {error}
          </p>
        )}
        {mensaje && (
          <p className="mb-4 rounded-md border border-green-500 bg-green-50 p-3 text-green-900" role="status">
            {mensaje}
          </p>
        )}

        {cargando ? (
          <p role="status">Cargando países…</p>
        ) : paises.length === 0 ? (
          <p className={`rounded-lg border p-6 ${panel}`}>No hay países para mostrar.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paises.map((pais) => {
              const id = obtenerIdPais(pais)
              const nombre = pais.nombreOficial || pais.nombreOfficial || 'País sin nombre'

              return (
                <li className={`rounded-lg border p-5 shadow-sm ${panel}`} key={id}>
                  <div className="mb-4 flex items-center gap-3">
                    {pais.image && (
                      <img
                        className="h-9 w-14 rounded border border-slate-300 object-contain"
                        src={pais.image}
                        alt={`Bandera de ${nombre}`}
                      />
                    )}
                    <h3 className="text-lg font-bold">{nombre}</h3>
                  </div>
                  <p className="mb-4 text-sm opacity-80">
                    Capital: {mostrarValor(pais.capital)}
                  </p>
                  <button
                    className="rounded-md border border-blue-500 px-3 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
                    type="button"
                    onClick={() => verDetalle(id)}
                  >
                    Ver detalle
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {paisSeleccionado && !modoFormulario && (
          <section
            className={`mt-8 rounded-lg border p-6 shadow-sm ${panel}`}
            aria-labelledby="detalle-titulo"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold" id="detalle-titulo">
                {paisSeleccionado.nombreOficial || paisSeleccionado.nombreOfficial}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700"
                  type="button"
                  onClick={iniciarEdicion}
                >
                  Editar
                </button>
                <button
                  className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
                  type="button"
                  onClick={confirmarEliminacion}
                >
                  Eliminar
                </button>
                <button
                  className="rounded-md border border-current px-4 py-2"
                  type="button"
                  onClick={cerrarDetalle}
                >
                  Cerrar detalle
                </button>
              </div>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="font-semibold">Capital</dt><dd>{mostrarValor(paisSeleccionado.capital)}</dd></div>
              <div><dt className="font-semibold">Idioma(s)</dt><dd>{mostrarValor(paisSeleccionado.languages)}</dd></div>
              <div><dt className="font-semibold">Países limítrofes</dt><dd>{mostrarValor(paisSeleccionado.borders)}</dd></div>
              <div><dt className="font-semibold">Área</dt><dd>{mostrarValor(paisSeleccionado.area)}</dd></div>
              <div className="sm:col-span-2"><dt className="font-semibold">URL de bandera</dt><dd className="break-all">{mostrarValor(paisSeleccionado.image)}</dd></div>
            </dl>
          </section>
        )}

        {modoFormulario && (
          <section className={`mt-8 rounded-lg border p-6 shadow-sm ${panel}`}>
            <h2 className="mb-5 text-2xl font-bold">
              {modoFormulario === 'editar' ? 'Editar país' : 'Agregar país'}
            </h2>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={guardarPais}
            >
              <label className="font-medium">
                Nombre oficial
                <input
                  className={campo}
                  name="nombreOficial"
                  value={formulario.nombreOficial}
                  onChange={(event) => cambiarCampo(event.target.name, event.target.value)}
                  required
                  maxLength={90}
                />
              </label>
              <label className="font-medium">
                Capital
                <input
                  className={campo}
                  name="capital"
                  value={formulario.capital}
                  onChange={(event) => cambiarCampo(event.target.name, event.target.value)}
                  required
                  maxLength={200}
                />
              </label>
              <label className="font-medium">
                Idioma(s)
                <input
                  className={campo}
                  name="languages"
                  value={formulario.languages}
                  onChange={(event) => cambiarCampo(event.target.name, event.target.value)}
                  required
                  maxLength={200}
                />
              </label>
              <label className="font-medium">
                Área (km²)
                <input
                  className={campo}
                  name="area"
                  type="number"
                  min="0"
                  step="1"
                  value={formulario.area}
                  onChange={(event) => cambiarCampo(event.target.name, event.target.value)}
                  required
                />
              </label>
              <label className="font-medium">
                Países limítrofes
                <input
                  className={campo}
                  name="borders"
                  value={formulario.borders}
                  onChange={(event) => cambiarCampo(event.target.name, event.target.value)}
                  pattern="^([A-Z]{3})([,\\s]+[A-Z]{3})*$"
                  placeholder="ARG, BRA"
                />
              </label>
              <label className="font-medium">
                URL de bandera
                <input
                  className={campo}
                  name="image"
                  type="url"
                  value={formulario.image}
                  onChange={(event) => cambiarCampo(event.target.name, event.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando…' : 'Guardar'}
                </button>
                <button
                  className="rounded-md border border-current px-5 py-2"
                  type="button"
                  onClick={cancelarFormulario}
                  disabled={guardando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  )
}

export default PaisesAmericaView
