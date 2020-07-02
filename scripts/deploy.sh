#!/usr/bin/env bash

if [ "${CIRCLE_BRANCH}" == "production" ]; then
  VERCEL_ORG_ID=${VERCEL_ORG_ID} VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID} vercel --token ${VERCEL_TOKEN} --prod --confirm
elif [ "${CIRCLE_BRANCH}" == "master" ]; then
  VERCEL_ORG_ID=${VERCEL_ORG_ID} VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID} vercel --token ${VERCEL_TOKEN} --confirm
else
  echo "Environment not found!"
  exit 1
fi