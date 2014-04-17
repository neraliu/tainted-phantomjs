#!/usr/bin/env bash

# Run tests
bin/phantomjs test/run-tainted-tests.js

exit $?
