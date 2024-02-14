cd ../../
yarn super-install
cd packages/accounts-schema
yarn
yarn build
cd ../accounts-server
yarn
yarn vercel:build:prod