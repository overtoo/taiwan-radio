#!/bin/bash
# Script to create GitHub repo and deploy

echo "Creating GitHub repository..."
gh repo create taiwan-radio --public --source=. --remote=origin --push

echo ""
echo "Deploying to Vercel..."
npx vercel --yes

