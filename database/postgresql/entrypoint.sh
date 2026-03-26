#!/bin/bash

chown postgres /var/lib/postgresql/tls.crt
chmod 600 /var/lib/postgresql/tls.crt

chown postgres /var/lib/postgresql/tls.key
chmod 600 /var/lib/postgresql/tls.key

chown postgres /var/lib/postgresql/ca.crt
chmod 600 /var/lib/postgresql/ca.crt

exec /usr/local/bin/docker-entrypoint.sh postgres -c config_file=/var/lib/postgresql/postgresql.conf
