#!/bin/bash

# Function to fetch and process schema
fetch_and_process_schema() {
  local schema_url="https://woaiik2.afrupqj.cn/docs/api-docs.json"
  local output_json="src/types/api-schema/index.json"
  local output_schema="src/types/api-schema/index.d.ts"

  echo "Fetching API schema from $schema_url..."

  # Ensure the output directory exists
  mkdir -p "$(dirname "$output_json")"
  mkdir -p "$(dirname "$output_schema")"

  # Fetch the schema
  if ! curl -o "$output_json" "$schema_url"; then
    echo "Failed to fetch schema from $schema_url"
    exit 1
  fi

  echo "Schema downloaded successfully to $output_json"

  # Format the schema
  echo "Formatting schema with prettier..."
  npx prettier --write "$output_json"

  # Generate TypeScript definitions
  echo "Generating TypeScript definitions..."
  npx openapi-typescript "$output_json" -o "$output_schema"

  echo "API schema update completed successfully!"
  echo "JSON schema: $output_json"
  echo "TypeScript definitions: $output_schema"
}

# Fetch and process the schema
fetch_and_process_schema