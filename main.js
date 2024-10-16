const { app, BrowserWindow, screen, globalShortcut } = require('electron');
const { execSync, spawn, exec } = require('child_process');
const path = require('path');

let win;
let javaProcess;
let isJavaReady = false;  // Flag to track Java readiness
let isRedisReady = false; // Flag to track Redis readiness
let zoomFactor = 1.5; // Default zoom factor

// Function to create the Electron window
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width,
    height: height,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Ensure this for proper Angular and Electron integration
      enableRemoteModule: true,
      webSecurity: false, // If you face issues with resources loading, set to false
      zoomFactor: zoomFactor // Set the zoom factor on window load
    },
    icon: path.join(__dirname, 'kifa7i.png'), // Update path to the icon
    fullscreen: false,
    menuBarVisible: true,
  });

  // Disable default browser zoom (we are implementing custom zoom)
  win.webContents.setZoomFactor(zoomFactor);  // Set the default zoom factor
  console.log("Default Zoom Factor set to - ", zoomFactor * 100, "%");

  // Load the HTML file
  win.loadFile('dist/kf7/index.html');

  win.on('closed', () => {
    win = null;
  });

  // Listen for mouse wheel zoom
  win.webContents.on('wheel', (event) => {
    const delta = event.deltaY;
    if (event.ctrlKey) {
      if (delta < 0) {
        zoomIn();
      } else if (delta > 0) {
        zoomOut();
      }
    }
  });
}

// Function to zoom in
function zoomIn() {
  zoomFactor += 0.1;
  win.webContents.setZoomFactor(zoomFactor);
  console.log("Zoomed In: ", zoomFactor * 100, "%");
}

// Function to zoom out
function zoomOut() {
  zoomFactor -= 0.1;
  win.webContents.setZoomFactor(zoomFactor);
  console.log("Zoomed Out: ", zoomFactor * 100, "%");
}

// Function to handle zoom via keyboard shortcuts
function registerZoomShortcuts() {
  globalShortcut.register('CommandOrControl+=', () => {
    zoomIn();
  });

  globalShortcut.register('CommandOrControl+-', () => {
    zoomOut();
  });

  globalShortcut.register('CommandOrControl+0', () => {
    zoomFactor = 1; // Reset to default zoom factor
    win.webContents.setZoomFactor(zoomFactor);
    console.log("Zoom reset to default: ", zoomFactor * 100, "%");
  });
}

function isJavaProcessRunning() {
  try {
    const output = execSync('tasklist').toString();
    return output.includes('java.exe'); // Modify this if you want a more specific check
  } catch (error) {
    console.error('Error checking Java processes:', error);
    return false;
  }
}

function runJava() {
  const jarPath = path.join(__dirname, 'app.jar');

  if (!isJavaProcessRunning()) {
    javaProcess = spawn('java', ['-jar', jarPath]);

    javaProcess.stdout.on('data', (data) => {
      console.log(`Java Output: ${data}`);
      if (data.toString().includes('Started')) { // Assuming Java outputs 'Started' when ready
        isJavaReady = true;
        checkIfReadyToLaunch();
      }
    });

    javaProcess.stderr.on('data', (data) => {
      console.error(`Java Error: ${data}`);
    });

    javaProcess.on('close', (code) => {
      console.log(`Java process exited with code ${code}`);
    });
  } else {
    isJavaReady = true;
    checkIfReadyToLaunch();
  }
}

function runRedis() {
  if (!isRedisRunning()) {
    const redisPath = path.resolve(__dirname, 'Redis/redis-server.exe');

    exec(`start /b "" "${redisPath}" >nul 2>&1`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting Redis: ${error.message}`);
        return;
      }
      console.log('Redis started successfully');
      isRedisReady = true;
      checkIfReadyToLaunch();
    });
  } else {
    isRedisReady = true;
    checkIfReadyToLaunch();
  }
}

function isRedisRunning() {
  try {
    const output = execSync('tasklist').toString();
    return output.toLowerCase().includes('redis-server.exe');
  } catch (error) {
    console.error('Error checking Redis process:', error);
    return false;
  }
}

function checkIfReadyToLaunch() {
  if (isJavaReady && isRedisReady) {
    createWindow();
  }
}

app.on('ready', () => {
  // Run both Java and Redis, then launch the window when both are ready
  runRedis();  // Start Redis first
  runJava();   // Start Java next

  registerZoomShortcuts(); // Register zoom shortcuts
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
