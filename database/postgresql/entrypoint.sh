#!/bin/bash

chown postgres /var/lib/postgresql/tls.crt
chmod 600 /var/lib/postgresql/tls.crt

chown postgres /var/lib/postgresql/tls.key
chmod 600 /var/lib/postgresql/tls.key

chown postgres /var/lib/postgresql/ca.crt
chmod 600 /var/lib/postgresql/ca.crt
