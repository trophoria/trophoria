FROM redislabs/rejson:latest

WORKDIR /redis

COPY redis.conf /usr/local/etc/redis/redis.conf
COPY init-redis.sh ./

RUN chmod +x init-redis.sh
