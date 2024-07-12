const { app, BrowserWindow, screen,dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
let win;
let javaProcess;

const DEFAULT_ZOOM_FACTOR = 1.5; // Set default zoom factor to zoom in by default

function isJavaProcessRunning() {
  try {
    // Execute a command to list Java processes
    const output = execSync('jps').toString();
    // Check if the output contains the name of your JAR file or any Java-related process you expect to be running
    return output.includes('app.jar');
  } catch (error) {
    // Handle any errors, e.g., if 'jps' command is not available
    console.error('Error checking Java processes:', error);
    return false;
  }
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
    },
    fullscreen: false,
  });

  // Set default zoom factor to zoom in by default
  win.webContents.zoomFactor = DEFAULT_ZOOM_FACTOR;

  // Set default zoom factor
  try {
    win.webContents.setZoomFactor(DEFAULT_ZOOM_FACTOR);
    console.log("Default Zoom Factor set to - ", DEFAULT_ZOOM_FACTOR * 100, "%");
  } catch (e) {
    console.error("Error setting default zoom level:", e);
  }

  win.loadFile('dist/sakai-ng/index.html');
  const jarPath = path.join(__dirname, 'app.jar');

  // Spawn Java process if not already running
  if (!isJavaProcessRunning()) {
    javaProcess = spawn('java', ['-jar', jarPath]);

    // Handle Java process events
    javaProcess.stdout.on('data', (data) => {
      console.log(`Java Output: ${data}`);
    });
    javaProcess.stderr.on('data', (data) => {
      console.error(`Java Error: ${data}`);
    });
    javaProcess.on('close', (code) => {
      console.log(`Java process exited with code ${code}`);
    });
  }

  // Set zoom level limits and handle zoom changes
  try {
    win.webContents.setVisualZoomLevelLimits(1, 4)
      .then(console.log("Zoom Levels Have been Set between 100% and 500%"))
      .catch((err) => console.log(err));

    win.webContents.on("zoom-changed", (event, zoomDirection) => {
      console.log(zoomDirection);
      var currentZoom = win.webContents.getZoomFactor();
      console.log("Current Zoom Factor - ", currentZoom);

      if (zoomDirection === "in" && currentZoom < 4) {
        win.webContents.zoomFactor = currentZoom + 0.20;
        console.log("Zoom Factor In  ", win.webContents.zoomFactor );
      }

      if (zoomDirection === "out") {
        // Calculate the new zoom factor based on screen dimensions
        win.webContents.zoomFactor = currentZoom - 0.20;
        console.log("Zoom Factor Out ", win.webContents.zoomFactor   );
      }
    });
  } catch (e) {
    console.error("Error setting zoom level:", e);
  }

  // Dynamically adjust window size based on screen size
  win.on('resize', () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    win.setSize(width, height);
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

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
