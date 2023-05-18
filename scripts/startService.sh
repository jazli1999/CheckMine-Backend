#!/bin/bash

node scripts/genPartSql.js
python scripts/populateDB.py
npm run dev