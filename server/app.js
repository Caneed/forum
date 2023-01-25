const express = require('express')
const multer = require('multer')
const path = require('path')
const { db, genid } = require('./db/dbUtil.js')
// 引入body-parser解决body为undefined的问题
const app = express()
const port = 3000
// 跨域请求
app.use(function (req, res, next) {
  // 允许跨域请求的域名,'*'代表任何域名
  res.header('Access-Control-Allow-Origin', '*')
  // 允许跨域请求的header类型
  res.header('Access-Control-Allow-Headers', '*')
  // 允许跨域请求的方法
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,GET,POST,OPTIONS')
  next()
})
// json中间件
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 上传
const update = multer({
  dest: './public/upload/temp'
})
// 将token判断的方法写成自定义中间件的形式
// 接口前加上_token的都会进行token判断
const ADMIN_TOKEN_PATH = '/_token'
app.all('*', async (req, res, next) => {
  // 如果路由
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    // 前端传入一个token,后端接收此token来进行查询是否admin表中有这个token
    let token = req.headers.token
    let admin_token_sql = 'SELECT * FROM `admin` WHERE `token`=?'
    let adminMessage = await db.async.all(admin_token_sql, [token])
    // 如果查询出错或者是查询出的结果数组长度为0则表示没有进行登录
    if (adminMessage.err != null || adminMessage.rows.length == 0) {
      res.send({
        code: 403,
        msg: '请先登录'
      })
      return
    } else {
      next()
    }
  } else {
    next()
  }
})
app.use(update.any())
app.use(express.static(path.join(__dirname, 'public')))
// 用户路由的注册
app.use('/admin', require('./routers/adminRouter'))
//类别路由的注册
app.use('/category', require('./routers/categoryRouter.js'))
// 博客路由注册
app.use('/blog', require('./routers/blogRouter.js'))
// 上传路由的注册
app.use('/upload', require('./routers/uploadRouter.js'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))