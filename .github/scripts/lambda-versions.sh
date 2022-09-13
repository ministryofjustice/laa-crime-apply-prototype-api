#!/bin/sh -l
READ_VERSION=$(node --eval="process.stdout.write(require('./aws/lambda/read-crime-applications/package.json').version)")
WRITE_VERSION=$(node --eval="process.stdout.write(require('./aws/lambda/write-crime-applications/package.json').version)")

echo ::set-output name=read::$READ_VERSION
echo ::set-output name=write::$WRITE_VERSION
