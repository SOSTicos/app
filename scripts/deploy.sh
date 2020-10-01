#!/usr/bin/env bash

readonly SERVERLESS_DIR=.serverless
readonly SERVERLESS_YML=serverless.yml
readonly SERVERLESS_TEMPLATES_DIR=.serverless_templates

# Ensure SERVERLESS_DIR exists and it is empty.
if [[ ! -d $SERVERLESS_DIR ]]; then
  mkdir $SERVERLESS_DIR
else
  rm -f $SERVERLESS_DIR/*
fi

if [ "${CIRCLE_BRANCH}" == "production" ]; then
  cp $SERVERLESS_TEMPLATES_DIR/prod/* $SERVERLESS_DIR
  cp prod-$SERVERLESS_YML $SERVERLESS_YML
  npx serverless
elif [ "${CIRCLE_BRANCH}" == "master" ]; then
  cp $SERVERLESS_TEMPLATES_DIR/dev/* $SERVERLESS_DIR
  cp dev-$SERVERLESS_YML $SERVERLESS_YML
  npx serverless
else
  echo "Environment not found!"
  exit 1
fi

# Cleanup serverless yml file.
if [[ -f $SERVERLESS_YML ]]; then
  rm -f $SERVERLESS_YML
fi
