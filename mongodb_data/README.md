# MongoDB Data Directory

Este directorio contiene los datos persistentes de MongoDB.

## ⚠️ Importante
- No eliminar este directorio si tienes datos importantes
- Los archivos aquí son gestionados por MongoDB
- El contenido se crea automáticamente cuando MongoDB inicia

## 🗂️ Estructura típica después del primer uso:
```
mongodb_data/
├── WiredTiger
├── WiredTigerLAS.wt
├── collection-*.wt
├── index-*.wt
├── journal/
├── _mdb_catalog.wt
└── diagnostic.data/
```

## 🔧 Para limpiar la base de datos:
1. Detener los contenedores: `docker-compose down`
2. Eliminar el contenido: `Remove-Item .\mongodb_data\* -Recurse -Force` (PowerShell)
3. Reiniciar: `docker-compose up`

## 📊 Verificar tamaño:
```bash
# En PowerShell
Get-ChildItem .\mongodb_data -Recurse | Measure-Object -Property Length -Sum

# En bash/terminal
du -sh ./mongodb_data
```
