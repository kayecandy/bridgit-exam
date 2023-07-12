cd ./be
npm install
npm run build

cd ../fe
npm install
export VUE_APP_BE_URL
echo ${VUE_APP_BE_URL}
npm run build