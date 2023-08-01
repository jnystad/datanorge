#!/usr/bin/env bash

set -e

node download.js
node ingest.js
node ping.js