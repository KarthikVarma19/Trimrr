#!/usr/bin/env bash
# Load local env vars from .env (gitignored) and start the backend on JDK 21.
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home}"
exec ./mvnw spring-boot:run
