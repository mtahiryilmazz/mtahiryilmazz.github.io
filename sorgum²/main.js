//Electron paketini kullanarak bir uygulama oluşuturuyoruz.
const {app, BrowserWindow, Tray} = require('electron')
// Import the Nucleus Library and init with your app id
const { dialog } = require('electron')
var path = require('path')
const Swal = require('sweetalert2')






// Burada pencere objesini global referans olarak tutuyoruz. Eğer bunu yapmaz isek pencere otomatik olarak kapanacak.
let win

function createWindow () {
  // Yeni bir pencere oluşturuyoruz.
  // Pencere ilk açıldığında genişliği 800, yüksekliği 600 px olacak.
win = new BrowserWindow({
width: 600,
height: 600,
titleBarStyle: 'hidden',
icon: path.join(__dirname, 'm2.ico'),
resizable: false,
})
win.setMenu(null)



  // Uygulamanın içerisine index.html dosyasını yükle.
  win.loadURL(`file://${__dirname}/index.html`)

  // Bu kısım şart değil, yazarsanız uygulama başladığında sağ tarafta konsolu görürsünüz. Kodları incelemek açısından şimdilik kalsın.
   //win.webContents.openDevTools()

  // Pencere kapandığında uygulamayı kapat.
  win.on('closed', () => {
    win = null
  })
}

// Bu metod Electron başladığında çağırılacak ve bir tarayıcı penceresi oluşturacak.
app.on('ready', createWindow)

// Tüm pencereler kapatıldığında uygulamayı sonlandır.
app.on('window-all-closed', () => {
  // MacOS sistemlerde uygulama ekranı kapanmasına rağman menü çubuğu hala aktif kalabildiğinden dolayı MacOs için ayriyetten bu kodu yazıyoruz.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Yine MacOS'ta Dock üzerinde uygulama iconuna tekrar tıklayınca bir pencere daha açar.
  if (win === null) {
    createWindow()
  }
})

// Bu dosyada uygulama ile ilgili başka ana işlemler kodları yazmaya devam edebiliriz.
// Ayrıca onları başka bir dosyaya yazıp buraya referans vererek kullanabiliriz.
