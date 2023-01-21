// 测试路由
const { response } = require('express')
const express = require('express')

const router = express.Router()

const { db, genid } = require('../db/dbUtil')

// 添加接口
router.post('/_token/add', async (req, res) => {
  // 添加种类
  // 将name属性从请求体中解构出来
  let { name } = req.body
  const insert_sql = 'INSERT INTO `category` (`id`,`name`) VALUES (?,?)'
  // 调用插入方法，依次传入sql语句和参数，id是雪花id生成的，name是传入的
  let { err } = db.async.run(insert_sql, [genid.NextId(), name])
  if (err == null) {
    res.send({
      code: 200,
      msg: '添加成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '添加失败'
    })
  }
})

// 修改接口
router.put('/_token/update', async (req, res) => {
  // 添加种类
  let { id, name } = req.body
  const update_sql = 'UPDATE `category` SET `name`=? WHERE `id`=?'
  let { err } = db.async.run(update_sql, [name, id])
  if (err == null) {
    res.send({
      code: 200,
      msg: '修改成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '修改失败'
    })
  }
})

// 删除接口
// localhost:3000/category/delete?id=XXXXXXX
router.delete('/_token/delete', async (req, res) => {
  let id = req.query.id
  const delete_sql = 'DELETE FROM `category` WHERE `id` = ?'
  let { err } = db.async.run(delete_sql, [id])
  if (err == null) {
    res.send({
      code: 200,
      msg: '删除成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '删除失败'
    })
  }
})

// 列表接口
router.get('/list', async (req, res) => {
  const list_sql = 'SELECT * FROM `category`'
  db.all(list_sql, [], (err, rows) => {
    if (err == null) {
      res.send({
        code: 200,
        msg: '查询成功',
        rows
      })
    } else {
      res.send({
        code: 500,
        msg: '查询失败'
      })
    }
  })
})

module.exports = router