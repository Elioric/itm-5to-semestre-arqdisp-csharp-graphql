# Ejemplos de Operaciones GraphQL - Juegos de Mesa

Este archivo contiene ejemplos prácticos de todas las operaciones disponibles para gestionar juegos de mesa.

## URL del GraphQL Playground en Contenedor
http://localhost:37111/graphql

---

## 1. CONSULTAS (QUERIES)

### 1.1 Obtener todos los juegos de mesa
```graphql
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
```

### 1.2 Obtener un juego específico por ID
```graphql
query {
  getBoardGame(id: "673c5f8e123456789abcdef0") {
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

---

## 2. CREAR JUEGO (CREATE)

### 2.1 Crear un juego básico
```graphql
mutation {
  createBoardGame(boardGame: {
    nombre: "Carcassonne"
    minJugadores: 2
    maxJugadores: 5
    edadMinima: 7
    idioma: "Español"
    dependenciaIdioma: 0
  })
}
```

### 2.2 Crear un juego con dependencia parcial de idioma
```graphql
mutation {
  createBoardGame(boardGame: {
    nombre: "7 Wonders Duel"
    minJugadores: 2
    maxJugadores: 2
    edadMinima: 10
    idioma: "Español"
    dependenciaIdioma: 1
  })
}
```

### 2.3 Crear un juego con dependencia total de idioma
```graphql
mutation {
  createBoardGame(boardGame: {
    nombre: "Gloomhaven"
    minJugadores: 1
    maxJugadores: 4
    edadMinima: 14
    idioma: "Inglés"
    dependenciaIdioma: 2
  })
}
```

### 2.4 Crear un juego cooperativo
```graphql
mutation {
  createBoardGame(boardGame: {
    nombre: "Spirit Island"
    minJugadores: 1
    maxJugadores: 4
    edadMinima: 13
    idioma: "Inglés"
    dependenciaIdioma: 2
  })
}
```

---

## 3. ACTUALIZAR JUEGO (UPDATE)

### 3.1 Actualizar solo el nombre
```graphql
mutation {
  updateBoardGame(_id: "673c5f8e123456789abcdef0", boardGame: {
    nombre: "Carcassonne: Edición Deluxe"
  })
}
```

### 3.2 Actualizar número de jugadores
```graphql
mutation {
  updateBoardGame(_id: "673c5f8e123456789abcdef0", boardGame: {
    minJugadores: 2
    maxJugadores: 6
  })
}
```

### 3.3 Actualizar idioma y dependencia
```graphql
mutation {
  updateBoardGame(_id: "673c5f8e123456789abcdef0", boardGame: {
    idioma: "Español"
    dependenciaIdioma: 0
  })
}
```

### 3.4 Actualización completa
```graphql
mutation {
  updateBoardGame(_id: "673c5f8e123456789abcdef0", boardGame: {
    nombre: "Pandemic Legacy: Season 1"
    minJugadores: 2
    maxJugadores: 4
    edadMinima: 13
    idioma: "Español"
    dependenciaIdioma: 2
  })
}
```

---

## 4. ELIMINAR JUEGO (DELETE)

### 4.1 Eliminar un juego por ID
```graphql
mutation {
  deleteBoardGame(_id: "673c5f8e123456789abcdef0")
}
```

---

## 5. EJEMPLOS DE JUEGOS COMPLETOS PARA CREAR

### 5.1 Juego de estrategia clásico
```graphql
mutation {
  createBoardGame(boardGame: {
    nombre: "Puerto Rico"
    minJugadores: 3
    maxJugadores: 5
    edadMinima: 12
    idioma: "Español"
    dependenciaIdioma: 1
  })
}
```

### 5.2 Juego familiar
```graphql
mutation {
  createBoardGame(boardGame: {
    nombre: "Ticket to Ride: Europe"
    minJugadores: 2
    maxJugadores: 5
    edadMinima: 8
    idioma: "Español"
    dependenciaIdioma: 0
  })
}
```

### 5.3 Juego de cartas
```graphql
mutation {
  createBoardGame(boardGame: {
    nombre: "Dominion"
    minJugadores: 2
    maxJugadores: 4
    edadMinima: 13
    idioma: "Español"
    dependenciaIdioma: 1
  })
}
```

### 5.4 Juego abstracto
```graphql
mutation {
  createBoardGame(boardGame: {
    nombre: "Azul: Stained Glass of Sintra"
    minJugadores: 2
    maxJugadores: 4
    edadMinima: 8
    idioma: "Cualquiera"
    dependenciaIdioma: 0
  })
}
```

---

## 6. CASOS DE ERROR COMUNES

### 6.1 Intentar crear un juego con nombre duplicado
```graphql
# Esto fallará si ya existe un juego llamado "Catan"
mutation {
  createBoardGame(boardGame: {
    nombre: "Catan"
    minJugadores: 3
    maxJugadores: 4
    edadMinima: 10
    idioma: "Español"
    dependenciaIdioma: 1
  })
}
```

### 6.2 Dependencia de idioma inválida
```graphql
# Error: dependenciaIdioma debe ser 0, 1 o 2
mutation {
  createBoardGame(boardGame: {
    nombre: "Juego Inválido"
    minJugadores: 2
    maxJugadores: 4
    edadMinima: 10
    idioma: "Español"
    dependenciaIdioma: 5
  })
}
```

### 6.3 Mínimo mayor que máximo
```graphql
# Error: minJugadores no puede ser mayor a maxJugadores
mutation {
  createBoardGame(boardGame: {
    nombre: "Juego Inválido"
    minJugadores: 6
    maxJugadores: 4
    edadMinima: 10
    idioma: "Español"
    dependenciaIdioma: 1
  })
}
```

---

## 7. VALORES PARA DEPENDENCIA DE IDIOMA

- **0 (NINGUNA)**: El juego no depende del idioma (ej: Azul, Chess, Go)
- **1 (PARCIAL)**: Algunas cartas o componentes tienen texto (ej: 7 Wonders, Catan)
- **2 (TOTAL)**: El juego está completamente en un idioma específico (ej: Gloomhaven, Pandemic Legacy)

---

## 8. CONSEJOS PARA USAR LA API

1. **IDs de MongoDB**: Los IDs reales de MongoDB tienen formato ObjectId (24 caracteres hexadecimales)
2. **Validaciones**: La API valida automáticamente los rangos de jugadores y dependencia de idioma
3. **Nombres únicos**: No se pueden crear juegos con nombres duplicados (case-insensitive)
4. **GraphQL Playground**: Usa la interfaz en http://localhost:37111/graphql para probar las consultas
5. **Introspección**: El schema está disponible en el playground para explorar todos los campos disponibles

---

## 9. EJEMPLO DE FLUJO COMPLETO

```graphql
# 1. Ver todos los juegos actuales
query {
  getBoardGames {
    _id
    nombre
  }
}

# 2. Crear un nuevo juego
mutation {
  createBoardGame(boardGame: {
    nombre: "Mi Nuevo Juego"
    minJugadores: 2
    maxJugadores: 4
    edadMinima: 10
    idioma: "Español"
    dependenciaIdioma: 1
  })
}

# 3. Buscar el juego creado y obtener su ID
query {
  getBoardGames {
    _id
    nombre
  }
}

# 4. Actualizar el juego (usa el ID real obtenido)
mutation {
  updateBoardGame(_id: "ID_REAL_AQUI", boardGame: {
    nombre: "Mi Juego Actualizado"
  })
}

# 5. Verificar la actualización
query {
  getBoardGame(id: "ID_REAL_AQUI") {
    _id
    nombre
    minJugadores
    maxJugadores
    edadMinima
    idioma
    dependenciaIdioma
  }
}

# 6. Eliminar el juego (opcional)
mutation {
  deleteBoardGame(_id: "ID_REAL_AQUI")
}
```
