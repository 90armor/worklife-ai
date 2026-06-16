#!/bin/sh
set -e

cd /var/www/html

php artisan config:clear
php artisan cache:clear

php artisan migrate --force

exec php-fpm
