# Proyecto React

Proyecto base con React y Vite.

## Desarrollo

```sh
pnpm install
pnpm dev
```

## Conexión con MockAPI

Las URLs de origen y destino están configuradas en `src/.env`. El servicio obtiene los países desde Rest Countries y guarda los hispanohablantes con Axios en el recurso `paises` de MockAPI.

Pulsa **Obtener y guardar países** para sincronizar los registros. Las ejecuciones siguientes actualizan el país existente en vez de agregarlo otra vez, y eliminan duplicados previos del mismo país. Reinicia `pnpm dev` después de cambiar las URLs del archivo `.env`.

## Validación

```sh
pnpm lint
pnpm build
```
