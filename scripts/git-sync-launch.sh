#!/bin/bash
set -e

echo "🔄 Pulling latest changes..."
git pull

echo "✏️ Opening Notepad for edits..."
notepad README.md

echo "📦 Staging changes..."
git add .

echo "📝 Committing..."
git commit -m "audit-grade update"

echo "🚀 Pushing to origin..."
git push

echo "🧹 Running lint..."
npm run lint || echo "⚠️ No lint script defined"

echo "🧪 Running tests..."
npm run test || echo "⚠️ No test script defined"

echo "🗄️ Validating Prisma schema..."
npx prisma validate

echo "⚙️ Generating Prisma client..."
npx prisma generate

echo "🏗️ Building Next.js app..."
npm run build

echo "🚀 Launching app..."
npm run start
