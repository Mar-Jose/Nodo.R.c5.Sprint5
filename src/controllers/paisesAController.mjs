import paisesAServices from '../services/paisesAServices.mjs'

export async function obtenerTodosLospaisesAController(req, res, next) {
  try {
    const paisesD = await paisesAServices.obtenerTodos()
    const success = ['created', 'updated'].includes(req.query.success) ? req.query.success : ''
    res.render('dashboard', { paisesD, success })
  } catch (error) {
    next(error)
  }
}

export function rutaParaFormularioVistaAddController(_req, res) {
  res.render('addpaisesA')
}

export async function AgregarPaisesAController(req, res, next) {
  if (req.validationErrors?.length) {
    return res.status(400).render('addpaisesA', { errores: req.validationErrors })
  }

  try {
    await paisesAServices.crearPais(req.body)
    res.redirect('/api/paisesA?success=created')
  } catch (error) {
    if (error.message === 'El país ya existe') {
      return res.status(409).render('addpaisesA', {
        errores: [{ msg: error.message }],
      })
    }
    next(error)
  }
}

export async function mostrarFormularioEdicionController(req, res, next) {
  try {
    const paisesE = await paisesAServices.obtenerPorId(req.params.id)
    res.render('editpaisesA', { paisesE, errores: [] })
  } catch (error) {
    next(error)
  }
}

export async function editarPaisesAController(req, res, next) {
  try {
    const paisesE = await paisesAServices.obtenerPorId(req.params.id)
    if (req.validationErrors?.length) {
      return res.status(400).render('editpaisesA', {
        paisesE: { ...paisesE, ...req.body },
        errores: req.validationErrors,
      })
    }

    await paisesAServices.editarPais(req.params.id, req.body)
    res.redirect('/api/paisesA?success=updated')
  } catch (error) {
    next(error)
  }
}

export async function eliminarPaisesAController(req, res, next) {
  try {
    await paisesAServices.eliminarPais(req.params.id)
    res.redirect('/api/paisesA')
  } catch (error) {
    next(error)
  }
}

export async function buscarPaisPorAtributoController(req, res, next) {
  try {
    const { atributo, valor } = req.query
    const paisesD = await paisesAServices.buscarPaisPorAtributo(atributo, valor || '')
    res.render('dashboard', { paisesD, success: '' })
  } catch (error) {
    next(error)
  }
}

export function mostrarVistaBusquedaController(_req, res) {
  res.render('searchPais')
}
