# Configuración de Docker para API de Homologaciones

Este documento describe cómo ejecutar la API de Homologaciones utilizando Docker y Docker Compose.

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Base de datos PostgreSQL externa configurada con la estructura necesaria

## Estructura de archivos Docker

- `Dockerfile`: Configuración para construir la imagen de la aplicación
- `docker-compose.yml`: Configuración del servicio de API
- `.env.docker`: Variables de entorno para Docker
- `.dockerignore`: Archivos a ignorar al construir la imagen

## Configuración

1. **Variables de entorno**: Edita el archivo `.env.docker` para configurar:
   - Conexión a la base de datos externa
   - Puerto de la aplicación
   - Configuración de AWS S3
   - Secretos y URLs para servicios externos

## Ejecución con Docker Compose

### Iniciar la aplicación

```bash
docker-compose --env-file .env.docker up -d
```

Esta instrucción:
- Construye la imagen Docker si es necesario
- Crea y inicia el contenedor
- Establece las variables de entorno desde `.env.docker`
- Ejecuta el contenedor en modo "detached" (en segundo plano)

### Ver logs de la aplicación

```bash
docker-compose logs -f
```

### Detener la aplicación

```bash
docker-compose down
```

### Reconstruir después de cambios

```bash
docker-compose --env-file .env.docker build --no-cache
docker-compose --env-file .env.docker up -d
```

## Configuración de la base de datos

Esta configuración asume que ya tienes una base de datos PostgreSQL configurada y accesible. Asegúrate de:

1. La base de datos esté accesible desde el contenedor Docker (configura el host correctamente)
2. Las credenciales en `.env.docker` sean correctas
3. La estructura de tablas ya exista en la base de datos

## Acceso a la aplicación

Una vez iniciado el contenedor, podrás acceder a:

- **API**: http://localhost:4000/api
- **Documentación Swagger**: http://localhost:4000/api/docs

## Solución de problemas

- **Error de conexión a la base de datos**: 
  - Verifica que el host de la base de datos esté bien configurado
  - Asegúrate de que la base de datos acepte conexiones desde la red del contenedor
  - Revisa que las credenciales sean correctas

- **Puertos ocupados**: 
  - Si tienes servicios ejecutándose en el puerto 4000, cámbialo en `.env.docker`

- **Variables de entorno**:
  - Si tienes problemas con credenciales o configuraciones, verifica el archivo `.env.docker`