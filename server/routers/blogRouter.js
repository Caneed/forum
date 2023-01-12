// 测试路由
const express = require('express')

const router = express.Router()

const { db, genid } = require('../db/dbUtil')

const date = new Date()

// 添加博客
router.post('/add', async (req, res) => {
  // 前端传来分类id，题目，内容
  let { category_id, title, content } = req.body
  let insert_sql = 'INSERT INTO `blog` (`id`,`category_id`,`title`,`content`,`createdAt`,`updatedAt`) VALUES (?,?,?,?,?,?)'
  db.run(insert_sql, [genid.NextId(), category_id, title, content, date.toLocaleString(), date.toLocaleString()], (err, rows) => {
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
})
// 修改博客
router.put('/update', async (req, res) => {
  // 前端传来id,分类id，题目，内容
  let {id,category_id, title, content } = req.body
  let update_sql = 'UPDATE `blog`  SET `title`=?,`content`=?,`category_id`=?,`updatedAt`=? WHERE `id` =?'
  db.run(update_sql,[title,content,category_id,date.toLocaleString(),id],(err,rows)=>{
    if(err==null){
      res.send({
        msg:'修改成功',
        code:200
      })
    }else{
      res.send({
        msg:`修改失败,错误消息:${err}`,
        code:500
      })
    }
  })
})
// 删除博客
router.delete('/delete',async(req,res)=>{
  let {id}=req.body
  let delete_sql='DELETE FROM `blog` WHERE `id`=?'
  db.run(delete_sql,[id],(err,rows)=>{
    if(err==null){
      res.send({
        msg:'删除成功',
        code:200
      })
    }else{
      res.send({
        msg:`删除失败,错误原因:${err}`,
        code:500
      })
    }
  })
})
// 查询博客
router.get('/search', async (req, res) => {
  // 前端传入关键字，进行一个模糊查询
  let {key_word}=req.body
  let search_sql=''
})

module.exports = router