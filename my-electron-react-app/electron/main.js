const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development'

  const win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    backgroundColor: '#000000',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 🔐 Interceptar el cierre de la ventana
  win.on('close', async (e) => {
    e.preventDefault() // ⚠️ Detiene el cierre por defecto

    const { response } = await dialog.showMessageBox(win, {
      type: 'question',
      buttons: ['Cancelar', 'Salir'],
      defaultId: 1,
      cancelId: 0,
      title: '¿Estás seguro?',
      message: '¿Deseas salir de la aplicación?',
    })

    if (response === 1) {
      win.destroy() // 🔓 Cerrar la ventana si elige "Salir"
    }
    // Si no, simplemente se cancela
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
