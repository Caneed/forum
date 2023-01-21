// 测试路由
const express = require('express')

const router = express.Router()

const { db, genid } = require('../db/dbUtil')

const date = new Date()

// 添加博客
router.post('/_token/add', async (req, res) => {
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
router.put('/_token/update', async (req, res) => {
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
router.delete('/_token/delete',async(req,res)=>{
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
  let {key_word,category_id,page,pageSize}=req.query
  // 判断是否传入这些参数
  page=page==null?1:page
  pageSize=pageSize==null?10:pageSize
  category_id=category_id==null?0:category_id
  key_word=key_word==null?'':key_word
  // 进行sql语句的拼装
  // sql语句和params参数都设置为数组
  let search_sql=[]
  let params=[]
  if(category_id!==0){
    // 如果传入了分类id则从数组中push相关的sql语句和参数
    search_sql.push(' `category_id`= ? ')
    params.push(category_id)
  }
  if(key_word!==''){
    // 关键字也一样(关键字和标题以及内容相关所以需要push两次)
    search_sql.push(' (`title` LIKE ? OR `content` LIKE ?) ')
    params.push('%'+key_word+'%')
    params.push('%'+key_word+'%')
  }
  let sql_str=''
  if(search_sql.length>0){
    // 进行sql语句的拼装
    sql_str=' WHERE '+search_sql.join(' AND ')
  }
  let sql='SELECT * FROM `blog`'+sql_str+'ORDER BY `createdAt` DESC LIMIT ?,? '
  // limit中的参数指的是从第几条开始往后取几条数据,所以使用(page-1)*pageSize,pageSize
  let search_params=params.concat([(page-1)*pageSize,pageSize])

  // 查询总数的sql
  let search_count=' SELECT count(*) FROM `blog` '+sql_str
  let searchCount=params

  // 分页数据的查询
  let search_res=await db.async.all(sql,search_params)
  let count_res=await db.async.all(search_count,searchCount)
  console.log(search_res)
  console.log(sql);

  if(search_res.err==null&&count_res.err==null){
    res.send({
      code:200,
      msg:'查询成功',
      data:{
        key_word,
        category_id,
        page,
        pageSize,
        rows:search_res.rows,
        count:count_res.rows[0].count
      }
    })
  }else{
    res.send({
      code:500,
      msg:'查询失败'
    })
  }
})

module.exports = router