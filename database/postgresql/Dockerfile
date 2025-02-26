FROM postgres:13-alpine

COPY ./database/cert/dev/tls.crt /var/lib/postgresql/tls.crt
COPY ./database/cert/dev/tls.key /var/lib/postgresql/tls.key
COPY ./database/cert/dev/ca.crt /var/lib/postgresql/ca.crt

RUN chown postgres /var/lib/postgresql/tls.crt
RUN chmod 600 /var/lib/postgresql/tls.crt

RUN chown postgres /var/lib/postgresql/tls.key
RUN chmod 600 /var/lib/postgresql/tls.key

RUN chown postgres /var/lib/postgresql/ca.crt
RUN chmod 600 /var/lib/postgresql/ca.crt
