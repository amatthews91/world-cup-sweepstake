# Sweepstake Player Entry Utility
## What is this?
A simple command line tool to allow players to be directly inserted into the hosted firestore DB as I haven't had time to make something better.

## Setup
1. Generate a service account key file through the GCP IAM console, save it under `./.api-key/service-account.json`
1. Create a file called `players.csv` here (not passing as an arg so it can be git ignored)
1. Run `npm i`
1. Run `node index.js` (call that file whatever you like)

## Player File Format
A pipe-separated file with 4 columns where each row is in the form:

`[Player full name]|[predicted goals]|[goal teams (comma-separated)]|[outcome teams (comma-separated)]`
