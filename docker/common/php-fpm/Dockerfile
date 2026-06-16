FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer config policy.advisories.ignore-id PKSA-mdq4-51ck-6kdq PKSA-8qx3-n5y5-vvnd \
    PKSA-q46n-4fdk-zjr4 PKSA-qzrn-rnz3-85w1 PKSA-w7xr-vk7n-rstm \
    && composer install --no-interaction --prefer-dist --optimize-autoloader \
    && mkdir -p bootstrap/cache storage/logs storage/framework/{cache,sessions,views} \
    && chmod -R 775 bootstrap/cache storage

EXPOSE 9000

CMD ["php-fpm"]
