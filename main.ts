const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
   // Create the browser window.
   win = new BrowserWindow({
      height: 750,
      icon: `file://${__dirname}/dist/assets/logo.png`,
      width: 800,
   });

   // win.loadURL(`file://${__dirname}/dist/index.html`);
   win.loadURL(`http://localhost:4200/`);
   win.setMenuBarVisibility(false);

   // uncomment below to open the DevTools.
   // win.webContents.openDevTools();

   // Event when the window is closed.
   win.on('closed', () => {
      win = null;
   });
}

// Create window on electron intialization
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {

   // On macOS specific close process
   if (process.platform !== 'darwin') {
      app.quit();
   }
});

app.on('activate', () => {
   // macOS specific close process
   if (win === null) {
      createWindow();
   }
});
