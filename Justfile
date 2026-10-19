default:
    @just --list

# Install dependencies
install:
    yarn install

# Run the dev server with hot reload on http://localhost:3000 (dummy articles are visible)
dev:
    yarn dev

# Generate the static site into dist/ (like Netlify does)
generate:
    yarn generate

# Generate the static site and serve it on http://localhost:3000 (dummy articles are hidden)
serve: generate
    yarn preview

# Run ESLint
lint:
    yarn lint

# Run ESLint and fix what can be fixed automatically
lint-fix:
    yarn lint --fix

# Format all files with Prettier
fmt:
    yarn prettier --write 'app/**/*.{js,ts,vue}' '*.{ts,js,mjs}' 'scripts/*.mjs' 'cypress/e2e/*.js' 'cypress/support/*.ts' 'content/**/*.md'

# Run the type check
typecheck:
    yarn nuxt typecheck

# Generate the site and run all Cypress tests against it
test:
    yarn test:e2e:ci

# Generate the site and open the interactive Cypress UI
test-ui:
    yarn test:e2e

# Run all checks that CI runs
check: lint typecheck test

# Compare the generated site with the reference snapshot in test/site-snapshot/baseline
snapshot-diff: generate
    yarn snapshot
    yarn snapshot:diff

# Accept the generated site as the new reference snapshot
snapshot-accept: generate
    yarn snapshot:baseline

# Remove build output and caches
clean:
    rm -rf .nuxt .output .data dist node_modules/.cache
