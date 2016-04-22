[program:follow3-queue]
command=php artisan queue:listen
directory=/home/www/follow3_service
user=root
autorestart=true
redirect_stderr=true
stdout_logfile=/home/www/follow3_service/storage/logs/queue.log
loglevel=info