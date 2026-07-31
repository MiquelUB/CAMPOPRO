# Skill: Estratègia de Backups i Restauració

## Descripció
Aquesta habilitat cobreix el procés per assegurar les dades crítiques del sistema a CampoPro. Utilitza `pg_dump` per extreure bases de dades cap a AWS S3. Estableix una política de rotació de Backups, versions als fitxers S3 (per mitigar ransomwares), i defineix els mètodes de restauració i auditories periòdiques automatitzades de l'estat dels backups (amb avisos a Telegram en cas de fallada). També aprofita els Snapshots de Hetzner com a mètode de desastre del SO.

## Template

```bash
#!/bin/bash
# [PLACEHOLDER_DIR]/scripts/backup.sh
# Aquest script es crida per un cron cada nit a les 03:00 AM

set -e # Surt si hi ha error

DB_CONTAINER="campopro_db_1"
DB_USER="postgres"
DB_NAME="campopro"
BACKUP_DIR="/tmp/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="db_backup_${TIMESTAMP}.sql.gz"
S3_BUCKET="s3://campopro-backups-bucket/db/"

mkdir -p $BACKUP_DIR

# 1. Crear el dump i comprimir
docker exec $DB_CONTAINER pg_dump -U $DB_USER -d $DB_NAME | gzip > "$BACKUP_DIR/$FILENAME"

# 2. Pujar a AWS S3 usant l'AWS CLI integrat
aws s3 cp "$BACKUP_DIR/$FILENAME" $S3_BUCKET

# 3. Netejar fitxers antics locals (Rotació de 7 dies local)
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;

# 4. Validació i enviament d'alerta a Telegram en cas d'èxit o error
if [ $? -eq 0 ]; then
    MESSAGE="✅ Backup realitzat amb èxit: $FILENAME"
else
    MESSAGE="❌ ERROR realitzant el backup de base de dades a CampoPro!"
fi

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TELEGRAM_ADMIN_CHAT_ID}" \
    -d text="$MESSAGE"

rm "$BACKUP_DIR/$FILENAME" # Neteja de la descàrrega pesada temporal
```

```json
// [PLACEHOLDER_DIR]/aws/s3_lifecycle_policy.json
// Regla de rotació de backups (4 setmanes / 3 mesos) i expiració
{
  "Rules": [
    {
      "ID": "RotateDBBackups",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "db/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
```

## Exemple d'ús
### Procés de Restauració de Bases de Dades
Si el servidor falla, per restaurar l'últim estat:

1. **Descarrega el backup més recent d'S3**:
   ```bash
   aws s3 cp s3://campopro-backups-bucket/db/db_backup_20231031_030000.sql.gz ./
   ```
2. **Descomprimeix el fitxer**:
   ```bash
   gunzip db_backup_20231031_030000.sql.gz
   ```
3. **Bolca les dades dins el contenidor fresc de base de dades**:
   ```bash
   cat db_backup_20231031_030000.sql | docker exec -i campopro_db_1 psql -U postgres -d campopro
   ```

### Snapshots Setmanals de Hetzner
Activar-ho al panel de Hetzner Cloud:
- Cerca la VPS del projecte > Selecciona "Backups" > Tria "Auto-backups"
- Això guardarà tot el volum d'estat de la màquina setmanalment, independent de la BD, pel desastre complet.

## Validació
- Executar `./scripts/backup.sh` manualment i comprovar que: 1) l'arxiu arriba a S3 i 2) es rep missatge a Telegram.
- Importar l'arxiu S3 pujat a un entorn de proves (ex: Docker DB local) i confirmar la presència de les dades íntegres, sense errors d'índexs corruptes.
- Revisar l'activació del S3 Versioning a la consola d'AWS: En cas d'esborrament accidental d'una foto pujada, hi ha d'haver un historial amagat per recuperar-la.

## Errors comuns
- **No provar mai de restaurar el Backup**: Un arxiu backup danyat és l'equivalent a no tenir backup. Cal auditar la restauració.
- **Còpia sense comprimir**: Enviar Dumps crus (No Zipped) a la xarxa desaprofita amplada de banda costosa i alenteix l'operació.
- **Emmagatzemar secrets dins el dump**: Si es fan Backups s'han d'assegurar que el bucket a S3 té la màxima restricció (Cap accés públic; bloqueig d'ACL).
