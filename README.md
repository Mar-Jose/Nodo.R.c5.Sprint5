# Sazón

Aplicación React para buscar recetas en TheMealDB y gestionar un recetario con una API propia.

## Funcionalidades

- Buscar recetas en TheMealDB y precargar sus datos en el formulario.
- Crear, consultar, editar y eliminar recetas usando el backend de la aplicación.
- Filtrar por categoría y buscar en las recetas guardadas.
- Cada receta tiene siete campos: nombre, imagen, instrucciones, categoría, cocina/país, etiquetas y enlace de origen.
- Persistencia en un archivo JSON del backend; los clientes conectados al mismo servidor consultan el mismo recetario.

## Configuración

La app carga variables desde `src/.env`. TheMealDB se usa únicamente para buscar recetas:

```env
VITE_BASE_URL_API="https://www.themealdb.com/api/json/v1/"
```

La búsqueda usa la clave pública de prueba `1` y el endpoint `search.php?s=...`. No requiere contraseña de base de datos. No agregues credenciales ni secretos a variables `VITE_*`, porque se incluyen en el código enviado al navegador.

## Iniciar la app y el backend

En una terminal, instala dependencias e inicia la API:

```sh
pnpm install
pnpm server
```

En otra terminal, inicia React/Vite:

```sh
pnpm dev
```

Vite redirige `/api` al servidor Node local en `http://127.0.0.1:3001`. Las recetas se guardan en `server/data/recipes.json`, que se crea al agregar el primer registro y no se incluye en Git. `pnpm server:dev` inicia el backend en modo watch.

## Endpoints del backend

La API escucha localmente en el puerto `3001` (se puede cambiar con `PORT`):

- `GET /api/health` — estado del servidor.
- `GET /api/recipes` — lista las recetas.
- `GET /api/recipes/:id` — consulta el detalle.
- `POST /api/recipes` — crea una receta.
- `PATCH /api/recipes/:id` — actualiza los campos enviados.
- `DELETE /api/recipes/:id` — elimina una receta.

El backend valida campos, limita el cuerpo de cada solicitud a 1 MB y serializa las escrituras para evitar sobrescribir cambios simultáneos. Prueba los endpoints con `pnpm test:api`; ejecuta `pnpm lint` y `pnpm build` para validar frontend y backend.

TheMealDB es un catálogo de solo lectura: las búsquedas consultan esa API y las modificaciones se hacen en la API propia. El servidor se enlaza a `127.0.0.1` para desarrollo local; para acceso desde internet se requiere desplegarlo y configurar autenticación, almacenamiento apropiado y un proxy de producción. Los registros que existieran en una versión anterior guardada en `localStorage` no se migran automáticamente.
