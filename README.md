Download node.js

mkdir habit-tracker-background
cd habit-tracker-background

npm init -y

npm install electron react react-dom
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli


mkdir src build
echo. > main.js
echo. > index.html
echo. > src\App.js
echo. > src\index.js
echo. > webpack.config.js


npm run build

npm start
