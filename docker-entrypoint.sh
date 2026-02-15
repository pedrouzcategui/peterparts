#!/bin/bash
set -e # Detiene el script si algo falla

# 1. Entramos a la carpeta de trabajo
cd /var/www/html

# 2. ¿Está el proyecto creado?
if [ ! -f "artisan" ]; then
    echo "No se encontró un proyecto. Creando Laravel... 🛠️"
    # Usamos el instalador global que pusimos en el PATH
    laravel new . --no-interaction --force --database pgsql
    
    # Instalamos dependencias de frontend
    npm install
else
    echo "Proyecto detectado. Verificando dependencias... ✅"
    # Si descargaste el código de un repo, esto asegura que tengas las librerías
    composer install
fi

# 3. Permisos para que Laravel pueda escribir logs y caché
chown -R www-data:www-data storage bootstrap/cache

# 4. Iniciamos el servidor
exec apache2-foreground