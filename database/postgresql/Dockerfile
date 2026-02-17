FROM postgres:17-alpine

RUN apk add --no-cache su-exec

COPY database/postgresql/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

RUN chown postgres /var/lib/postgresql/ca.crt
RUN chmod 600 /var/lib/postgresql/ca.crt
