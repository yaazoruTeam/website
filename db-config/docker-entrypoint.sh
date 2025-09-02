#!/bin/bash
# Custom entrypoint for PostgreSQL with Yaazoru schema and audit logging

set -e

echo "🔧 Starting PostgreSQL with Yaazoru configuration..."

# Copy custom postgresql.conf if it exists
if [ -f /tmp/postgresql.conf ]; then
    echo "🔧 Applying custom PostgreSQL configuration..."
    # Wait for data directory to be initialized
    until [ -f /var/lib/postgresql/data/PG_VERSION ]; do
        echo "⏳ Waiting for PostgreSQL data directory initialization..."
        sleep 2
    done
    
    cp /tmp/postgresql.conf /var/lib/postgresql/data/postgresql.conf
    chown postgres:postgres /var/lib/postgresql/data/postgresql.conf
    echo "✅ Custom PostgreSQL configuration applied"
fi

# Create log directory
mkdir -p /var/lib/postgresql/data/log
chown postgres:postgres /var/lib/postgresql/data/log

# Initialize Yaazoru schema if initialization scripts exist
if [ -f /docker-entrypoint-initdb.d/init-yaazoru-schema.sql ]; then
    echo "�️ Yaazoru schema initialization script found"
fi

echo "�🚀 Starting PostgreSQL with Yaazoru audit logging..."

# Execute the original PostgreSQL entrypoint
exec docker-entrypoint.sh "$@"
