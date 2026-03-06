#!/bin/bash

echo "Type you commit :"
read commit

git add .
git commit -m "$commit"
git push