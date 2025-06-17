const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development';

  const win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    icon: path.join(__dirname, 'icono.png'), // 👈 Asegúrate de que icon.png esté aquí
    backgroundColor: '#000000',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
    //win.webContents.openDevTools({ mode: 'detach' });

  }

  // Confirmar antes de cerrar
  win.on('close', async (e) => {
    e.preventDefault();

    const { response } = await dialog.showMessageBox(win, {
      type: 'question',
      buttons: ['Cancelar', 'Salir'],
      defaultId: 1,
      cancelId: 0,
      title: '¿Estás seguro?',
      message: '¿Deseas salir de la aplicación?',
    });

    if (response === 1) {
      win.destroy();
    }
  });
}

// Lanzar
app.whenReady().then(createWindow);

// Cerrar en Windows/Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
