# Hypergamma react site demo

Biofeedback app demo with CSGO integration (WIP)

Repo live demo: https://hypergamma.netlify.app

## Run:

Get the latest Node.js LTS

Get the bundler: `npm i -g tinybuild`

Install Dependencies: `npm i`

Then: `npm start`

To include the csgo server: `npm run csgo`. This requires a separate program that monitors CSGO when playing and lets you link your steam account

To build tailwind css specifically: `npm run tailwind`

## Stack:

- NodeJS
- React
- Web Bluetooth/Serial via graphscript
- IndexedDB for local data
- CSGO server socket (url for server app: )

Todo: 

- Need a standalone backend (Josh can do this if needed)
- MongoDB (or other preferred e.g. firebase) for user accounts/subscriptions and persistent data
- Some kind of profile/user system, again we have some boilerplate for this incl notifications etc..
