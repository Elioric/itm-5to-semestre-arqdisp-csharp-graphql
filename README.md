# GraphQL API - Juegos de Mesa

Una API GraphQL que permite gestionar juegos de mesa utilizando MongoDB como base de datos.

## Características

- CRUD completo para juegos de mesa
- Validaciones de negocio
- Integración con MongoDB
- Esquemas GraphQL tipados

## Estructura del Proyecto

```
src/
├── data/
│   └── boardgamesdata.ts      # Datos de ejemplo
├── graphql/
│   ├── schemas/
│   │   └── boardgame.graphql  # Esquema GraphQL de juegos de mesa
│   └── resolvers/
│       └── boardgame.ts       # Resolvers de juegos de mesa
├── mongo/
│   └── index.ts              # Configuración MongoDB
└── index.ts                  # Servidor principal
```

## Modelo de Datos - Juego de Mesa

- **id**: Identificador único
- **nombre**: Nombre del juego (string)
- **minJugadores**: Número mínimo de jugadores (int)
- **maxJugadores**: Número máximo de jugadores (int)
- **edadMinima**: Edad mínima recomendada (int)
- **idioma**: Idioma del juego (string)
- **dependenciaIdioma**: Nivel de dependencia del idioma
  - 0: Ninguna
  - 1: Parcial
  - 2: Total

## Operaciones GraphQL

### Consultas (Queries)

```graphql
# Obtener todos los juegos de mesa
query {
  getBoardGames {
    _id
    nombre
    minJugadores
    maxJugadores
    edadMinima
    idioma
    dependenciaIdioma
  }
}

# Obtener un juego específico
query {
  getBoardGame(id: "1") {
    _id
    nombre
    minJugadores
    maxJugadores
    edadMinima
    idioma
    dependenciaIdioma
  }
}
```

### Mutaciones (Mutations)

```graphql
# Crear un nuevo juego
mutation {
  createBoardGame(boardGame: {
    nombre: "Nuevo Juego"
    minJugadores: 2
    maxJugadores: 4
    edadMinima: 10
    idioma: "Español"
    dependenciaIdioma: 1
  })
}

# Actualizar un juego existente
mutation {
  updateBoardGame(_id: "1", boardGame: {
    nombre: "Juego Actualizado"
    minJugadores: 3
    maxJugadores: 6
  })
}

# Eliminar un juego
mutation {
  deleteBoardGame(_id: "1")
}
```

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env con tus configuraciones
```

3. Variables de entorno disponibles:
- `PORT`: Puerto del servidor (por defecto: 4000)
- `MONGO_URI`: URL de conexión a MongoDB
- `DB_NAME`: Nombre de la base de datos
- `COUNTRIES_API_URL`: URL de la API de países
- `COUNTRIES_API_TIMEOUT`: Timeout para la API de países (ms)
- `COUNTRIES_CACHE_DURATION`: Duración del cache (ms)

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Acceder a GraphQL Playground en: `http://localhost:4000/graphql`

## Validaciones Implementadas

- El número mínimo de jugadores no puede ser mayor al máximo
- La dependencia de idioma debe estar entre 0 y 2
- No se pueden crear juegos con nombres duplicados
- Validación de existencia antes de actualizar o eliminar


# Comandos para correr la aplicación

```
npm i # Instalar dependencias del proyecto
npm run dev # Correr la aplicación localmente en modo desarrollo

docker-compose up -d --build # Construir imagen y subir servicios
podman compose up -d --build # Utilizar Podman en vez de Docker

docker-compose down # Bajar servicios con Docker
podman compose down # Bajar servicios con Podman
```

Se crea un archivo Dockerfile.dockerignore para evitar que se copien archivos innecesarios dentro de la imagen de contenedor que se está creando en el proyecto.