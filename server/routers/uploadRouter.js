const express = require('express')

const router = express.Router()

const fs = require('fs')

const { db, genid } = require('../db/dbUtil')


router.post('/wang_editor_upload', async (req, res) => {
  // 根据wangEditor的上传格式进行上传
  if (!req.files) {
    res.send({
      'errno': 1,
      "msg": '上传失败'
    })
    return
  }
  let files = req.files
  let ret_files = []
  // console.log(files)
  for (let file of files) {
    // 获取文件名的后缀,得到文件名中含有'.'的索引的下一个元素就是后缀名
    let file_ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
    // 使用雪花id随机生成文件名,加上后缀名的拼接
    let file_name = genid.NextId() + '.' + file_ext
    // 修改文件名字并且将文件移动
    fs.renameSync(process.cwd() + '/public/upload/temp/' + file.filename, process.cwd() + '/public/upload/' + file_name)
    ret_files.push('upload/'+file_name)
  }
  res.send({
    'errno':0,
    'data':{
      'url':ret_files[0]
    }
  })
})

module.exports = router