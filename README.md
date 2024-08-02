Download node.js

mkdir habit-tracker-background
cd habit-tracker-background

npm init -y

npm install auto-launch
npm install lucide-react
npm install electron react react-dom
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli

        Everything to install: npm install electron react react-dom lucide-react auto-launch


mkdir src build
echo. > main.js
echo. > index.html
echo. > src\App.js
echo. > src\index.js
echo. > webpack.config.js


npm run build

npm start



Create a shortcut to your application:

Right-click on your application's executable (usually found in node_modules\electron\dist\electron.exe)
Select "Create shortcut"


Move the shortcut to the Windows Startup folder:

Press Win + R to open the Run dialog
Type shell:startup and press Enter
This opens the Startup folder
Move the shortcut you created into this folder


Modify the shortcut to run your app:

Right-click on the shortcut in the Startup folder and select "Properties"
In the "Target" field, add the path to your app's main folder after the Electron executable path. It should look something like this:
Copy"C:\Path\To\node_modules\electron\dist\electron.exe" "C:\Path\To\Your\App"

Click "Apply" and then "OK"