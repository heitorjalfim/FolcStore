#!/bin/bash
OUTPUT="dump_projeto_equipe.txt"

echo "=== REPOSITÓRIO DA EQUIPE (COMPLETO) ===" > "$OUTPUT"
echo "DATA DA EXTRAÇÃO: $(date)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "--- 1. GIT STATUS E BRANCH ATUAL ---" >> "$OUTPUT"
git status -s >> "$OUTPUT" 2>/dev/null
git branch --show-current >> "$OUTPUT" 2>/dev/null
echo "" >> "$OUTPUT"

echo "--- 2. ÁRVORE COMPLETA DE PASTAS E ARQUIVOS ---" >> "$OUTPUT"
find . -not -path "*/node_modules*" \
       -not -path "*/.next*" \
       -not -path "*/.git*" \
       -not -name "$OUTPUT" \
       -not -name "package-lock.json" | sort >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "--- 3. CONTEÚDO INTEGRAL DE TODOS OS ARQUIVOS DO PROJETO ---" >> "$OUTPUT"
find . -type f \( \
    -name "*.ts" -o \
    -name "*.tsx" -o \
    -name "*.js" -o \
    -name "*.jsx" -o \
    -name "*.mjs" -o \
    -name "*.json" -o \
    -name "*.css" -o \
    -name "*.md" \
  \) \
  -not -path "*/node_modules*" \
  -not -path "*/.next*" \
  -not -path "*/.git*" \
  -not -name "package-lock.json" \
  -not -name "$OUTPUT" | sort | while read -r file; do
    echo "==================================================" >> "$OUTPUT"
    echo "ARQUIVO: $file" >> "$OUTPUT"
    echo "==================================================" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo "Concluído! Arquivo gerado: $OUTPUT"
