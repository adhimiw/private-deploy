FROM php:8.4-apache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libsqlite3-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_sqlite mbstring bcmath xml \
    && a2enmod rewrite headers expires deflate \
    && printf "ServerName localhost\n" > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername \
    && sed -ri 's/AllowOverride[[:space:]]+None/AllowOverride All/g' /etc/apache2/apache2.conf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY . /var/www/html
RUN composer install --working-dir=/var/www/html/backend --no-dev --no-interaction --prefer-dist --optimize-autoloader
RUN chmod +x /var/www/html/docker/start.sh

EXPOSE 80
