# CRUD de países con React, Express y MockAPI

## Desarrollo

```sh
pnpm install
pnpm dev
```

Abre `http://localhost:5173/`. Vite sirve la aplicación React y monta el backend Express en el mismo servidor. React consume los endpoints JSON de Express en `/api/paises`, y Express usa MockAPI como persistencia. No hace falta iniciar otro proceso ni usar el puerto 3000.

## Deploy

En un hosting Node.js configura el comando de build como `pnpm build` y el comando de inicio como `pnpm start`. El servidor sirve los archivos compilados de `dist/` y resuelve las rutas de React Router, incluso al abrir directamente o refrescar una ruta de detalle. Configura en el entorno del hosting `VITE_MOCKAPI_URL`, `VITE_BASE_URL_API` y `BASE_URL_FLAGS` con los valores correspondientes; `PORT` lo proporciona habitualmente el hosting.

La interfaz React permite listar países, consultar el detalle, crear, editar y eliminar. Las vistas EJS anteriores siguen disponibles bajo `/api/paisesA`.

La arquitectura del frontend mantiene el cliente Axios en `src/api/`, las operaciones de países en `src/services/`, el estado del CRUD en `src/context/PaisesContext.jsx` y la presentación en `src/components/`.

## Configuración de MockAPI

Configura `VITE_MOCKAPI_URL` en el `.env` de la raíz con la URL del recurso de MockAPI, por ejemplo `https://<proyecto>.mockapi.io/api/v1/paises`. También configura `VITE_BASE_URL_API` con la URL del JSON de países y `BASE_URL_FLAGS` con la URL base del CDN de banderas. Estas variables son requeridas; no hay URLs de servicio alternativas hardcodeadas en el código. El backend usa Axios para comunicarse con esos recursos; no requiere MongoDB.

La acción **Sincronizar desde fuente** descarga los países de América que incluyen español desde `VITE_BASE_URL_API` y crea o actualiza los registros en MockAPI. Esta operación se ejecuta en el backend.

El proyecto `mledoze/countries` publica los datos bajo la licencia ODbL; consulta sus condiciones de atribución y uso antes de redistribuirlos.

## API JSON

El frontend React llama a Express, y Express ejecuta las operaciones correspondientes en MockAPI:

| Método | Endpoint | Operación |
| --- | --- | --- |
| GET | `/api/paises` | Lista países |
| GET | `/api/paises/:id` | Obtiene el detalle de un país |
| POST | `/api/paises` | Crea un país |
| PUT | `/api/paises/:id` | Actualiza un país |
| DELETE | `/api/paises/:id` | Elimina un país |

Las rutas de administración EJS anteriores continúan disponibles en `/api/paisesA`. Reinicia `pnpm dev` después de cambiar la URL de MockAPI.

Los estilos de React y de las vistas EJS están hechos con utilidades de Tailwind CSS.

## Validación

```sh
pnpm lint
pnpm build
```
