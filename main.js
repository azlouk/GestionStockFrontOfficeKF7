const { app, BrowserWindow, screen, globalShortcut } = require('electron');
const { execSync, spawn } = require('child_process');
const path = require('path');

let win;
let javaProcess;

// Function to calculate zoom factor based on screen scale factor
function calculateZoomFactor() {
  const primaryDisplay = screen.getPrimaryDisplay();
  console.log(primaryDisplay)
  const scaleFactor = primaryDisplay.scaleFactor; // Get the scale factor
  const defaultZoomFactor = 1.5; // Default zoom factor
  return defaultZoomFactor * scaleFactor; // Adjust zoom based on scale factor
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width,
    height: height,
    resizable:true,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'kifa7i.png'), // Update the path to your icon
    fullscreen: false,
  });

  // Set zoom factor based on screen scale
  const zoomFactor = calculateZoomFactor();
  win.webContents.setZoomFactor(zoomFactor);
  console.log("Default Zoom Factor set to - ", zoomFactor * 100, "%");

  // Load the HTML file
  win.loadFile('dist/kf7/index.html');

  // Set zoom level limits
  win.webContents.setVisualZoomLevelLimits(1, 4)
      .then(() => console.log("Zoom Levels Have been Set between 100% and 400%"))
      .catch((err) => console.log(err));

  // Dynamically adjust window size based on screen size
  win.on('resize', () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    win.setSize(width, height);
  });

  win.on('closed', () => {
    win = null;
  });

  // Apply zoom with a delay
  function applyZoomWithDelay() {
    setTimeout(() => {
      win.webContents.setZoomFactor(zoomFactor);
      console.log("Zoom Factor applied with delay: ", zoomFactor * 100, "%");
    }, 500); // Adjust the delay time as needed
  }

  // Apply zoom after window events
  win.on('show', applyZoomWithDelay);
  win.on('focus', applyZoomWithDelay);
  win.on('maximize', applyZoomWithDelay);
  win.on('restore', applyZoomWithDelay);
}

app.on('ready', () => {
  createWindow();

  // Register a keyboard shortcut to focus the window (optional)
  globalShortcut.register('CommandOrControl+I', () => {
    if (win) {
      win.show();
    } else {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
