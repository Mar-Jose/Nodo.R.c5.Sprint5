import express from 'express';
import {
  obtenerTodosLospaisesAController,
  AgregarPaisesAController,
  rutaParaFormularioVistaAddController,
  mostrarFormularioEdicionController,
  editarPaisesAController,
  eliminarPaisesAController,
  buscarPaisPorAtributoController,
  mostrarVistaBusquedaController,
} from '../controllers/paisesAController.mjs';

import { paisesAValidations } from '../validations/paisesAValidaciones.mjs';
import { validate } from '../validations/validationMiddleware.mjs';

const router = express.Router();

router.get('/', obtenerTodosLospaisesAController)
router.get('/agregar', rutaParaFormularioVistaAddController)
router.post('/agregar', paisesAValidations, validate, AgregarPaisesAController)
router.get('/editar/:id', mostrarFormularioEdicionController)
router.get('/buscar', buscarPaisPorAtributoController)
router.get('/mostrar', mostrarVistaBusquedaController)
router.put('/editar/:id', paisesAValidations, validate, editarPaisesAController)
router.delete('/id/:id', eliminarPaisesAController)

export default router;