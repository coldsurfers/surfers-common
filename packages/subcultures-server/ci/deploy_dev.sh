#!/bin/sh

SLS_DEBUG=* cp ./.env.dev ./.env && rm -rf ./.build && sls deploy --stage dev