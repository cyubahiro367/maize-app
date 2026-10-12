#!/usr/bin/env bash
#
# rename_maize.sh — rename "Corn_Common_Rust (N).jpg/.JPG" files into
# two labelled groups, ordered by the number inside the parentheses.
#
#   first  SPLIT files -> GLS_MUS_001.jpg, GLS_MUS_002.jpg, ...
#   the rest           -> NLB_NYA_001.jpg, NLB_NYA_002.jpg, ...
#
# Usage:
#   ./rename_maize.sh                     # DRY RUN: shows what WOULD happen
#   ./rename_maize.sh --apply             # actually rename (current folder)
#   ./rename_maize.sh --apply /path/dir   # actually rename in a given folder
#
# Tip: always run it once without --apply and read the plan first.

set -euo pipefail

# ---- config ----------------------------------------------------------------
GROUP1_PREFIX="GLS_MUS"
GROUP2_PREFIX="NLB_NYA"
SPLIT=50            # first SPLIT files -> group 1, remainder -> group 2
OUT_EXT="jpg"       # output extension (lowercased)
# ----------------------------------------------------------------------------

APPLY=0
DIR="."
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    *)       DIR="$arg" ;;
  esac
done

cd "$DIR"

# Collect files, sorted numerically by the (N) in the filename.
mapfile -t files < <(
  for f in *.jpg *.JPG; do
    [ -e "$f" ] || continue
    n=$(printf '%s\n' "$f" | sed -n 's/.*(\([0-9]\+\)).*/\1/p')
    [ -n "$n" ] || continue
    printf '%s\t%s\n' "$n" "$f"
  done | sort -n -k1,1 | cut -f2-
)

total=${#files[@]}
if [ "$total" -eq 0 ]; then
  echo "No files matching 'Corn_Common_Rust (N).jpg/.JPG' found in: $(pwd)"
  exit 1
fi

echo "Found $total files in $(pwd)"
if [ "$APPLY" -eq 1 ]; then
  echo ">>> APPLY mode: files WILL be renamed"
else
  echo ">>> DRY RUN: nothing changes (add --apply to actually rename)"
fi
echo

g1=0; g2=0
for i in "${!files[@]}"; do
  src="${files[$i]}"
  if [ "$i" -lt "$SPLIT" ]; then
    g1=$((g1+1))
    dst=$(printf '%s_%03d.%s' "$GROUP1_PREFIX" "$g1" "$OUT_EXT")
  else
    g2=$((g2+1))
    dst=$(printf '%s_%03d.%s' "$GROUP2_PREFIX" "$g2" "$OUT_EXT")
  fi

  if [ -e "$dst" ] && [ "$src" != "$dst" ]; then
    echo "SKIP (target already exists): $dst"
    continue
  fi

  printf '%s  ->  %s\n' "$src" "$dst"
  [ "$APPLY" -eq 1 ] && mv -n -- "$src" "$dst"
done

echo
echo "Group 1 ($GROUP1_PREFIX): $g1 files"
echo "Group 2 ($GROUP2_PREFIX): $g2 files"
