cd ../../
yarn super-install
cd packages/accounts-kit
yarn
yarn build
cd ../accounts-client
yarn
yarn vercel:build:prod