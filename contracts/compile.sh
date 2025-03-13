#!/bin/bash

# Compile with optimizer enabled and low runs value
forge build --optimize --optimizer-runs 50 --via-ir

# Check contract size
forge build --sizes 