#!/usr/bin/env bash
#
# install.sh — Install the haku bundle into your Claude Code config.
#
# Creates symlinks from your Claude config directory back into this repo.
# Symlinks (not copies) so:
#   1. Pulling updates from this repo updates your installed skills automatically.
#   2. You can identify bundle items at a glance: any symlink in
#      ~/.claude/skills/ or ~/.claude/agents/ pointing into this repo is ours.
#   3. Uninstall is clean — see scripts/uninstall.sh.
#
# Usage:
#   scripts/install.sh [--scope=user|project] [--force] [--pack <name>|all ...]
#
#   --scope=user       Default. Installs to ~/.claude/{skills,agents}/
#   --scope=project    Installs to ./.claude/{skills,agents}/ (current dir)
#   --force            Overwrite existing skills/agents with the same name
#                      (default behavior is to skip with a warning)
#   --pack <name>      Also install an opt-in pack from plugin/packs/<name>
#                      (repeatable; `--pack all` installs every pack)
#
# Examples:
#   scripts/install.sh
#   scripts/install.sh --scope=project
#   scripts/install.sh --pack people --pack comms
#   scripts/install.sh --force

set -euo pipefail

# ---------- argument parsing ----------

SCOPE="user"
FORCE=0
PACKS=()

for arg in "$@"; do
  case "$arg" in
    --scope=user) SCOPE="user" ;;
    --scope=project) SCOPE="project" ;;
    --force) FORCE=1 ;;
    --pack=*) PACKS+=("${arg#--pack=}") ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

# ---------- paths ----------

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
SOURCE_DIR="$REPO_ROOT/plugin"

if [ ! -d "$SOURCE_DIR/skills" ] || [ ! -d "$SOURCE_DIR/agents" ]; then
  echo "Error: bundle directory not found at $SOURCE_DIR" >&2
  echo "Expected: $SOURCE_DIR/skills/ and $SOURCE_DIR/agents/" >&2
  exit 1
fi

# ---------- resolve packs ----------

PACK_SKILL_DIRS=()
PACK_AGENT_DIRS=()

if [ ${#PACKS[@]} -gt 0 ]; then
  available="$(ls "$SOURCE_DIR/packs" 2>/dev/null || true)"
  for p in "${PACKS[@]}"; do
    if [ "$p" = "all" ]; then
      for dir in "$SOURCE_DIR/packs"/*/; do
        [ -d "$dir" ] || continue
        PACK_SKILL_DIRS+=("$dir/skills")
        PACK_AGENT_DIRS+=("$dir/agents")
      done
    elif [ -d "$SOURCE_DIR/packs/$p" ]; then
      PACK_SKILL_DIRS+=("$SOURCE_DIR/packs/$p/skills")
      PACK_AGENT_DIRS+=("$SOURCE_DIR/packs/$p/agents")
    else
      echo "Error: unknown pack '$p'. Available: ${available:-none}" >&2
      exit 1
    fi
  done
fi

case "$SCOPE" in
  user)
    TARGET_BASE="$HOME/.claude"
    ;;
  project)
    TARGET_BASE="$(pwd)/.claude"
    ;;
esac

TARGET_SKILLS="$TARGET_BASE/skills"
TARGET_AGENTS="$TARGET_BASE/agents"

mkdir -p "$TARGET_SKILLS" "$TARGET_AGENTS"

# ---------- pre-flight ----------

pack_item_count=0
for d in "${PACK_SKILL_DIRS[@]:-}" "${PACK_AGENT_DIRS[@]:-}"; do
  [ -n "$d" ] && [ -d "$d" ] && pack_item_count=$((pack_item_count + $(find "$d" -maxdepth 1 -mindepth 1 | wc -l | tr -d ' ')))
done

echo
echo "Bundle:    haku"
echo "Source:    $SOURCE_DIR"
echo "Target:    $TARGET_BASE"
echo "Force:     $([ $FORCE -eq 1 ] && echo yes || echo no)"
echo "Packs:     $(${#PACKS[@]} > 0 && echo "${PACKS[*]}" || echo none)"
echo
echo "Will install:"
echo "  - $(find "$SOURCE_DIR/skills" -maxdepth 1 -mindepth 1 -type d | wc -l | tr -d ' ') core skills"
echo "  - $(find "$SOURCE_DIR/agents" -maxdepth 1 -name '*.md' | wc -l | tr -d ' ') core agents"
echo "  - $pack_item_count pack items"
echo

read -p "Proceed? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# ---------- install ----------

INSTALLED=0
SKIPPED=0
REPLACED=0

install_skill_dir() {
  local source_skills="$1"
  local skill_dir skill_name target
  for skill_dir in "$source_skills"/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name=$(basename "$skill_dir")
    target="$TARGET_SKILLS/$skill_name"

    if [ -e "$target" ] || [ -L "$target" ]; then
      if [ -L "$target" ] && [ "$(readlink "$target")" = "${skill_dir%/}" ]; then
        # Already symlinked correctly to this exact location; skip silently.
        INSTALLED=$((INSTALLED + 1))
        continue
      fi
      if [ $FORCE -eq 1 ]; then
        rm -rf "$target"
        ln -s "${skill_dir%/}" "$target"
        REPLACED=$((REPLACED + 1))
        echo "  replaced: skills/$skill_name"
      else
        SKIPPED=$((SKIPPED + 1))
        echo "  skipped (exists): skills/$skill_name"
        continue
      fi
    else
      ln -s "${skill_dir%/}" "$target"
      INSTALLED=$((INSTALLED + 1))
    fi
  done
}

install_agent_dir() {
  local source_agents="$1"
  local agent_file agent_name target
  for agent_file in "$source_agents"/*.md; do
    [ -e "$agent_file" ] || continue
    agent_name=$(basename "$agent_file")
    target="$TARGET_AGENTS/$agent_name"

    if [ -e "$target" ] || [ -L "$target" ]; then
      if [ -L "$target" ] && [ "$(readlink "$target")" = "$agent_file" ]; then
        INSTALLED=$((INSTALLED + 1))
        continue
      fi
      if [ $FORCE -eq 1 ]; then
        rm -f "$target"
        ln -s "$agent_file" "$target"
        REPLACED=$((REPLACED + 1))
        echo "  replaced: agents/$agent_name"
      else
        SKIPPED=$((SKIPPED + 1))
        echo "  skipped (exists): agents/$agent_name"
        continue
      fi
    else
      ln -s "$agent_file" "$target"
      INSTALLED=$((INSTALLED + 1))
    fi
  done
}

install_skill_dir "$SOURCE_DIR/skills"
install_agent_dir "$SOURCE_DIR/agents"

for d in "${PACK_SKILL_DIRS[@]:-}"; do
  [ -n "$d" ] && [ -d "$d" ] && install_skill_dir "$d"
done
for d in "${PACK_AGENT_DIRS[@]:-}"; do
  [ -n "$d" ] && [ -d "$d" ] && install_agent_dir "$d"
done

# ---------- summary ----------

core_agents=$(find "$SOURCE_DIR/agents" -maxdepth 1 -name '*.md' | wc -l | tr -d ' ')
pack_agents=0
for d in "${PACK_AGENT_DIRS[@]:-}"; do
  [ -n "$d" ] && [ -d "$d" ] && pack_agents=$((pack_agents + $(find "$d" -maxdepth 1 -name '*.md' | wc -l | tr -d ' ')))
done

echo
echo "Done."
echo "  Installed/already current: $INSTALLED"
echo "  Replaced (--force):        $REPLACED"
echo "  Skipped (already exists):  $SKIPPED"
echo
if [ $SKIPPED -gt 0 ]; then
  echo "Note: skipped items already exist at the target with different content."
  echo "Re-run with --force to overwrite, or remove them manually first."
  echo
fi
echo "Verify in Claude Code: /agents (should list the bundle's $((core_agents + pack_agents)) agents)"
echo "To uninstall: scripts/uninstall.sh --scope=$SCOPE"
