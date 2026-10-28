#!/usr/bin/env bash

# SCRIPT DE RESPALDO AUTOMATIZADO - SERVIAT

set -euo pipefail

# 1. Configuración de Directorios y Fechas
BACKUP_DIR="./Escritorio"
LOG_FILE="$BACKUP_DIR/backup_execution.log"
FECHA=$(date +%Y-%m-%d_%H-%M-%S)
FILE_NAME="serviat_backup_$FECHA.dump"

mkdir -p "$BACKUP_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== INICIANDO RESPALDO AUTOMATIZADO DE SERVIAT ==="


# 2. Comprobar que la variable de entorno DB_URL exista
if [ -z "${DB_URL=postgresql://postgres.raivkveaazorqgskolew:1031422157As@aws-0-ca-central-1.pooler.supabase.com:5432/postgres}" ]; then
    log "ERROR CRÍTICO: La variable de entorno DB_URL no está definida."
    exit 1
fi

# 3. Ejecutar pg_dump
log "Ejecutando pg_dump para la base de datos de ServiAT..."
if pg_dump "$DB_URL" --schema=public --no-owner --no-privileges -F c -b -f "$BACKUP_DIR/$FILE_NAME"; then
    log "pg_dump finalizado exitosamente."
else
    log "ERROR CRÍTICO: Falló la ejecución de pg_dump."
    exit 1
fi

# 4. Validar que el archivo generado no esté vacío
TAMANO_BYTES=$(stat -c%s "$BACKUP_DIR/$FILE_NAME" 2>/dev/null || stat -f%z "$BACKUP_DIR/$FILE_NAME")

if [ "$TAMANO_BYTES" -le 1000 ]; then
    log "ALERTA: El archivo es muy pequeño ($TAMANO_BYTES bytes)."
    exit 1
fi

TAMANO_HUMANO=$(du -h "$BACKUP_DIR/$FILE_NAME" | cut -f1)
log "Tamaño del archivo: $TAMANO_HUMANO ($TAMANO_BYTES bytes)."

# 5. Generar Checksum SHA-256
sha256sum "$BACKUP_DIR/$FILE_NAME" > "$BACKUP_DIR/$FILE_NAME.sha256"
log "Huella SHA-256 calculada y almacenada."

# 6. Restringir permisos
chmod 600 "$BACKUP_DIR/$FILE_NAME" "$BACKUP_DIR/$FILE_NAME.sha256"
log "Permisos de archivo asegurados (600)."

log "=== RESPALDO COMPLETADO SATISFACTORIAMENTE: $FILE_NAME ==="