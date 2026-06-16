#!/bin/bash
# Delete all node_modules in the pnpm monorepo

echo "Removing node_modules..."

rm -rf pnpm-lock.yaml
# Remove root node_modules
rm -rf node_modules

# Remove node_modules in apps
rm -rf apps/server/node_modules

rm -rf apps/web/node_modules

# Remove node_modules in packages
rm -rf packages/shared/node_modules

# Remove node_modules in packages
rm -rf packages/hooks/node_modules

# Remove node_modules in packages
rm -rf packages/services/node_modules

rm -rf packages/utils/node_modules

echo "Done! All node_modules removed."
echo "Run 'pnpm install' to reinstall dependencies."