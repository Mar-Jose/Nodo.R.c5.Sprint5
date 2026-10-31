# Proyecto React

Proyecto base con React y Vite.

## Desarrollo

```sh
pnpm install
pnpm dev
```

## Backend con MockAPI

El comando `pnpm dev` inicia juntos Vite y Express. La aplicación React queda en la dirección que indique Vite (normalmente `http://localhost:5173`) y la interfaz Express en `http://localhost:3000`. El backend administra los países directamente en el recurso MockAPI usando Axios; no requiere MongoDB. Configura `VITE_MOCKAPI_URL` en el `.env` de la raíz antes de iniciar.

## Conexión con MockAPI

La interfaz React obtiene el listado desde el JSON público de [mledoze/countries](https://github.com/mledoze/countries) configurado en `VITE_BASE_URL_API`, filtra países de América que incluyen español y sincroniza los registros con MockAPI mediante Axios. Las banderas se muestran desde FlagCDN usando el código ISO de cada país.

Pulsa **Obtener y guardar países** para sincronizar los registros. Las ejecuciones siguientes actualizan el país existente en vez de agregarlo otra vez, y eliminan duplicados previos del mismo país. Reinicia `pnpm dev` después de cambiar las URLs del archivo `.env`.

El proyecto `mledoze/countries` publica los datos bajo la licencia ODbL; consulta sus condiciones de atribución y uso en el repositorio antes de redistribuir los datos.

## Validación

```sh
pnpm lint
pnpm build
```
