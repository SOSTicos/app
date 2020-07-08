#!/usr/bin/env bash

if [ "${CIRCLE_BRANCH}" == "production" ]; then
  netlify deploy -p -a ${NETLIFY_TOKEN} -s ${NETLIFY_PROD_SITE_ID} --prod
elif [ "${CIRCLE_BRANCH}" == "master" ]; then
  netlify deploy -p -a ${NETLIFY_TOKEN} -s ${NETLIFY_DEV_SITE_ID} --prod
else
  echo "Environment not found!"
  exit 1
fi