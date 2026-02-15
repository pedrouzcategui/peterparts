# Usamos la imagen oficial que ya tiene Apache y PHP 8.4
FROM php:8.4-apache

# Si queremos usar una version un poco mas ligera, podemos usar alpine, pero tenemos que instalar las dependencias nosotros
# FROM php:8.4-alpine

# Copiamos nuestro archivo index.php dentro de la carpeta pública del servidor
# Recuerda que todos los contenedores tienen Debian como sistema operativo base, así que la ruta es la misma
# COPY <origen, que se encuentra en el host, es decir, aqui> <destino, que se encuentra en el contenedor>
COPY index.php /var/www/html/