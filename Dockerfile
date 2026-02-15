# Usamos la imagen oficial que ya tiene Apache y PHP 8.4
FROM php:8.4-apache

# Installamos Node.js y npm para poder usar el comando npm run dev

# Si queremos usar una version un poco mas ligera, podemos usar alpine, pero tenemos que instalar las dependencias nosotros y configurar el server y demás
# FROM php:8.4-alpine

# Instalamos dependencias del sistema necesarias para que Laravel y Composer funcionen
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo_pgsql zip

# Instalamos composer haciendo uso de los multi stage builds
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Instalamos el instalador de Laravel de forma global
RUN composer global require laravel/installer

# Agregamos la ruta de los binarios globales de Composer al PATH
ENV PATH="/root/.composer/vendor/bin:${PATH}"

# Copiamos nuestro archivo index.php dentro de la carpeta pública del servidor
# Recuerda que todos los contenedores tienen Debian como sistema operativo base, así que la ruta es la misma
# COPY <origen, que se encuentra en el host, es decir, aqui> <destino, que se encuentra en el contenedor>

# 1. Traemos Node.js y NPM desde la imagen oficial
COPY --from=node:20 /usr/local/bin/node /usr/local/bin/node
COPY --from=node:20 /usr/local/lib/node_modules /usr/local/lib/node_modules

# 2. Creamos un enlace simbólico para que el sistema reconozca el comando 'npm'
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm

# Hacemos "CD" a la carpeta del proyecto para ejecutar los comandos de Laravel y npm
WORKDIR /var/www/html

# 2. Copiamos el script desde tu carpeta al contenedor
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# 3. ¡Aquí está el truco! Le damos permiso de ejecución dentro de la imagen
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 4. Definimos el punto de entrada
ENTRYPOINT ["docker-entrypoint.sh"]