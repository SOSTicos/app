#!/usr/bin/env bash

readonly SERVERLESS_DIR=.serverless
readonly SERVERLESS_YML=serverless.yml
readonly DEV_SERVERLESS_YML=dev-serverless.yml
readonly PROD_SERVERLESS_YML=prod-serverless.yml
readonly SERVERLESS_TEMPLATES_DIR=.serverless_templates

invoke_serverless () {
  npx serverless
  if [ $? -eq 0 ]
  then
    echo "SUCCESS"
  else
    echo "AWS serverless deployment failed. Exit Code $?" >&2
    exit 1
  fi
}

# Ensure SERVERLESS_DIR exists and it is empty.
if [[ ! -d $SERVERLESS_DIR ]]; then
  mkdir $SERVERLESS_DIR
else
  rm -f $SERVERLESS_DIR/*
fi

if [ "${CIRCLE_BRANCH}" == "production" ]; then
  cp $SERVERLESS_TEMPLATES_DIR/prod/* $SERVERLESS_DIR
  cp $PROD_SERVERLESS_YML $SERVERLESS_YML
  invoke_serverless
elif [ "${CIRCLE_BRANCH}" == "master" ]; then
  cp $SERVERLESS_TEMPLATES_DIR/dev/* $SERVERLESS_DIR
  cp $DEV_SERVERLESS_YML $SERVERLESS_YML
  invoke_serverless
else
  echo "Environment not found!"
  exit 1
fi

# Cleanup serverless yml file.
if [[ -f $SERVERLESS_YML ]]; then
  rm -f $SERVERLESS_YML
fi
