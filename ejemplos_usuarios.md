# Ejemplos de Usuarios y Validación de Países

Este archivo contiene ejemplos de cómo usar la funcionalidad de usuarios con validación de países.

## URL del GraphQL Playground
http://localhost:37111/graphql

---

## 1. CONSULTAS DE PAÍSES

### 1.1 Obtener todos los países disponibles
```graphql
query {
  getAllCountries {
    name
  }
}
```

### 1.2 Obtener información de un país específico
```graphql
query {
  getCountryInfo(countryName: "Spain") {
    id
    name
    abbreviation
    capital
    currency
    phone
    flag
    emblem
    orthographic
  }
}
```

### 1.3 Validar un país
```graphql
query {
  validateCountry(countryName: "Spain") {
    isValid
    countryInfo {
      name
      capital
      currency
    }
    message
    suggestions
  }
}
```

---

## 2. GESTIÓN DE USUARIOS

### 2.1 Crear un usuario (país válido)
```graphql
mutation {
  createUser(user: {
    nombre: "Juan Pérez"
    email: "juan.perez@email.com"
    pais: "Spain"
  })
}
```

```graphql
mutation {
  createUser(user: {
    nombre: "Gerard Pique"
    email: "nosoyshakifan@email.com"
    pais: "Spain"
  })
}
```

### 2.2 Crear usuario con país inválido (fallará)
```graphql
mutation {
  createUser(user: {
    nombre: "María García"
    email: "maria.garcia@email.com"
    pais: "Neverland"
  })
}
```

### 2.3 Obtener todos los usuarios
```graphql
query {
  getUsers {
    _id
    nombre
    email
    pais
    fechaRegistro
    activo
    countryInfo {
      name
      capital
      currency
    }
  }
}
```

### 2.4 Obtener un usuario específico
```graphql
query {
  getUser(id: "673c5f8e123456789abcdef0") {
    _id
    nombre
    email
    pais
    fechaRegistro
    countryInfo {
      name
      abbreviation
      capital
      currency
      population
      flag
    }
  }
}
```

### 2.5 Obtener usuarios por país
```graphql
query {
  getUsersByCountry(countryName: "Spain") {
    _id
    nombre
    email
    fechaRegistro
  }
}
```

---

## 3. ACTUALIZACIÓN DE USUARIOS

### 3.1 Actualizar nombre de usuario
```graphql
mutation {
  updateUser(_id: "673c5f8e123456789abcdef0", user: {
    nombre: "Juan Carlos Pérez"
  })
}
```

### 3.2 Cambiar país de usuario
```graphql
mutation {
  updateUser(_id: "673c5f8e123456789abcdef0", user: {
    pais: "Mexico"
  })
}
```

### 3.3 Actualizar email
```graphql
mutation {
  updateUser(_id: "673c5f8e123456789abcdef0", user: {
    email: "nuevo.email@ejemplo.com"
  })
}
```

### 3.4 Desactivar usuario
```graphql
mutation {
  updateUser(_id: "673c5f8e123456789abcdef0", user: {
    activo: false
  })
}
```

---

## 4. ELIMINACIÓN

### 4.1 Eliminar usuario
```graphql
mutation {
  deleteUser(_id: "673c5f8e123456789abcdef0")
}
```

---

## 5. CASOS DE VALIDACIÓN

### 5.1 Países válidos (ejemplos)
```graphql
# Estos países deberían funcionar
mutation {
  createUser(user: {
    nombre: "Usuario 1", email: "user1@test.com", pais: "United States"
  })
}

mutation {
  createUser(user: {
    nombre: "Usuario 2", email: "user2@test.com", pais: "Canada"  
  })
}

mutation {
  createUser(user: {
    nombre: "Usuario 3", email: "user3@test.com", pais: "Mexico"
  })
}

mutation {
  createUser(user: {
    nombre: "Usuario 4", email: "user4@test.com", pais: "Brazil"
  })
}
```

### 5.2 Validar países inválidos
```graphql
# Estos fallarán porque no existen en la API
query {
  validateCountry(countryName: "Estados Unidos") {
    isValid
    message
  }
}

query {
  validateCountry(countryName: "Reino Unido") {
    isValid
    message
  }
}

query {
  validateCountry(countryName: "Alemania") {
    isValid
    message
    suggestions
  }
}
```

---

## 6. CASOS DE ERROR COMUNES

### 6.1 Email duplicado
```graphql
# Crear primer usuario
mutation {
  createUser(user: {
    nombre: "Usuario Original"
    email: "duplicado@email.com"
    pais: "Spain"
  })
}

# Intentar crear otro con mismo email (fallará)
mutation {
  createUser(user: {
    nombre: "Usuario Duplicado"
    email: "duplicado@email.com"
    pais: "France"
  })
}
```

### 6.2 País inválido
```graphql
mutation {
  createUser(user: {
    nombre: "Usuario Test"
    email: "test@email.com"
    pais: "País Inexistente"
  })
}
```

### 6.3 Usuario no encontrado
```graphql
query {
  getUser(id: "000000000000000000000000")
}
```

---

## 7. FLUJO COMPLETO DE EJEMPLO

### 7.1 Flujo típico de registro
```graphql
# 1. Primero validar el país
query {
  validateCountry(countryName: "Colombia") {
    isValid
    countryInfo {
      name
      capital
      currency
    }
    suggestions
    message
  }
}

# 2. Si es válido, crear usuario
mutation {
  createUser(user: {
    nombre: "Carlos Rodríguez"
    email: "carlos.rodriguez@email.com"
    pais: "Colombia"
  })
}

# 3. Verificar que se creó correctamente
query {
  getUsers {
    _id
    nombre
    email
    pais
    countryInfo {
      name
      flag
    }
  }
}

# 4. Obtener ID del usuario y ver detalles completos
query {
  getUser(id: "ID_OBTENIDO_DEL_PASO_3") {
    _id
    nombre
    email
    pais
    fechaRegistro
    activo
    countryInfo {
      name
      abbreviation
      capital
      currency
      population
      flag
      emblem
    }
  }
}
```

---

## 8. CONSULTAS ÚTILES PARA ADMIN

### 8.1 Estadísticas por país
```graphql
# Ver usuarios de Estados Unidos
query {
  getUsersByCountry(countryName: "United States") {
    _id
    nombre
    email
    fechaRegistro
  }
}

# Ver información del país
query {
  getCountryInfo(countryName: "United States") {
    population
    currency
    capital
  }
}
```

### 8.2 Validación de países
```graphql
# Validar país válido
query {
  validateCountry(countryName: "Spain") {
    isValid
    countryInfo {
      name
      capital
      currency
      flag
    }
    message
  }
}

# Validar país inválido
query {
  validateCountry(countryName: "País Inexistente") {
    isValid
    message
  }
}
```

---

## 9. FUNCIONALIDADES DE AXIOS IMPLEMENTADAS

### 9.1 Validación en tiempo real
- **Verificación de países**: Cada vez que se crea/actualiza un usuario
- **Cache inteligente**: Los países se cachean por 24 horas
- **Validación exacta**: Verifica que el país existe en la API

### 9.2 Manejo de errores
- **Timeout**: 5 segundos máximo por petición
- **Fallback**: Si la API falla, usa cache anterior
- **Retry**: Cache como respaldo en caso de fallo

### 9.3 Optimizaciones
- **Una sola petición**: Obtiene todos los países al inicio
- **Búsqueda local**: Todas las validaciones se hacen en memoria
- **Datos enriquecidos**: Información completa del país automáticamente

---

## 10. PAÍSES DE EJEMPLO PARA PRUEBAS

Algunos países que definitivamente funcionan en la API:
- United States
- Canada  
- Mexico
- Brazil
- Spain
- France
- Germany
- Italy
- Japan
- Australia
- India
- China

Nombres que NO funcionarán (debes usar los nombres en inglés):
- Estados Unidos → Usa "United States"
- Reino Unido → Usa "United Kingdom"  
- Alemania → Usa "Germany"
- Japón → Usa "Japan"
