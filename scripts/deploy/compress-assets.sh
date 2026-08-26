#!/bin/sh

set -eu

target_dir=${1:-}
extensions=${2:-}

if [ -z "$target_dir" ] || [ -z "$extensions" ]; then
  echo "Usage: $0 <target_dir> <space-separated-extensions>" >&2
  exit 1
fi

set --
for ext in $extensions; do
  if [ "$#" -eq 0 ]; then
    set -- -name "*.$ext"
  else
    set -- "$@" -o -name "*.$ext"
  fi
done

if [ "$#" -gt 0 ]; then
  find "$target_dir" -type f \( "$@" \) -exec gzip -kf {} + -exec brotli -kf {} +
fi