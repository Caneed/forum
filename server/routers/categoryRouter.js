// 测试路由
const express = require('express')

const router = express.Router()

const { db, genid } = require('../db/dbUtil')

// 列表接口

// 添加接口
router.post('/add', async (req, res) => {
  // 添加种类
  let {name}=req.body
  const insertSql='INSERT INTO `category` (`id`,`name`) VALUES (?,?)'
  let {err,rows}=db.async.run(insertSql,[genid.NextId()],name)
  if(err==null){
    res.send({
      code:200,
      msg:'添加成功'
    })
  }else{
    res.send({
      code:200,
      msg:'添加失败'
    })
  }
})

// 修改接口
router.put('/update', async (req, res) => {
  // 添加种类
  let {id,name}=req.body
  const updateSql='UPDATE `category` SET `name`=? WHERE `id`=?'
  let {err,rows}=db.async.run(updateSql,[name,id])
  if(err==null){
    res.send({
      code:200,
      msg:'修改成功'
    })
  }else{
    res.send({
      code:200,
      msg:'修改失败'
    })
  }
})

module.exports = router