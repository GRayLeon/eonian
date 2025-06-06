const express =  require('express')

const rfs = require('rotating-file-stream')
const path = require('path')
const morgan = require('morgan')

const mongoose =  require('mongoose')
const cors = require("cors")

const app = express()
const port = 8080

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'logs'),
  maxFiles: 30
})

app.use(morgan('common', { stream: accessLogStream }))

require('dotenv').config({ path: __dirname + '/.env' })

mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection

db.on('err', err => console.log(err))
db.once('open', () => console.log('Connected to database.'))

app.use(express.json())

app.use(cors())
app.options('*', cors())


// 提供前台（根目錄）
app.use(express.static(path.join(__dirname, '../client/dist')))

// 提供 /admin 靜態資源
app.use('/admin', express.static(path.join(__dirname, '../admin/dist')))

// 提供 /admin SPA fallback（支援 Vue Router History 模式）
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/dist/index.html'))
})


// API 路由
const productRouter = require('./routes/product')
const projectRouter = require('./routes/project')
const newsRouter = require('./routes/news')
const brandRouter = require('./routes/brand')
const pagesRouter = require('./routes/pages')
const authRouter = require('./routes/auth')
const categoryRouter = require('./routes/category')
const sizeRouter = require('./routes/size')
const regionRouter = require('./routes/region')
const specRouter = require('./routes/spec')
const inquiryRouter = require('./routes/inquiry')

app.use("/api/product", productRouter)
app.use("/api/project", projectRouter)
app.use("/api/brand", brandRouter)
app.use("/api/news", newsRouter)
app.use("/api/pages", pagesRouter)
app.use("/api/auth", authRouter)
app.use("/api/category", categoryRouter)
app.use("/api/size", sizeRouter)
app.use("/api/region", regionRouter)
app.use("/api/spec", specRouter)
app.use("/api/inquiry", inquiryRouter)

// SPA fallback：只有非 /api 與非 /admin 時才導向前台 index.html
app.get(/^\/(?!api|admin).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.listen(port, () => console.log(`App is listening on port ${port}.`))