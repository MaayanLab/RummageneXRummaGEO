#!/bin/sh

cat >> /var/lib/postgresql/data/postgresql.conf << EOF
search_path = '"$user", public, app_public_v2, app_private_v2'
max_wal_size = 3GB
checkpoint_timeout = 30min
checkpoint_completion_target = 0.9
wal_buffers = '16MB'
EOF



