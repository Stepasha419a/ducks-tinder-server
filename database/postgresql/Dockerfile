FROM postgres:13-alpine

COPY ./database/cert/dev/certificate.pem /var/lib/postgresql/certificate.pem
COPY ./database/cert/dev/private-key.pem /var/lib/postgresql/private-key.pem
COPY ./database/cert/dev/ca.crt /var/lib/postgresql/ca.crt

RUN chown postgres /var/lib/postgresql/certificate.pem
RUN chmod 600 /var/lib/postgresql/certificate.pem

RUN chown postgres /var/lib/postgresql/private-key.pem
RUN chmod 600 /var/lib/postgresql/private-key.pem

RUN chown postgres /var/lib/postgresql/ca.crt
RUN chmod 600 /var/lib/postgresql/ca.crt
