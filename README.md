## Desktop Habit Tracker Tool

Ever feel like you just cant keep track of everything at once! Ah blah. I hear ya buddy. 

Here is the blockbustering, new and new **Habit tracker desktop tool**! It lives on your PC just like you... :) 

It keeps track of all the things I sadly forget to do. Keeping track of things like, when to take a break, when to eat, sleep meditiate, poop. Ok maybe not the pooping part, I lied I'm sorry.

Anyway, if you can forgive me try it out! It has an optional auto launch feature and resets everyday. So you can always know when to poo-.. always know when to take care of yourself.


## What it looks like

Plain view.
![Openview](/images/Openview.png)


Always in the background!
![Busy view](/images/View1.png)


---

### Setup Instructions:

1. Download node.js

2. npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli
2. npm install electron react react-dom lucide-react auto-launch

3. npm start

---


<details><summary>**If you want to setup auto launch**</summary>

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


</details>