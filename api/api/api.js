const express = require('express');
const router = express.Router();
const db = require('../link/link.js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const md5 = require('../enc.js');

const tw = (res, code, msg) => {
    res.send({
        'code': code,
        'msg': msg
    })
}

function isEmptyStr(s) {
    if (s == null || s === '') {
        return false
    }
    return true
}

function sqlerr(res, err) {
    console.log(err);
    tw(res, 500, '服务器错误');
}

//敲木鱼加功德
router.post('/user/addmerit', (req, res) => {
    let uuid = req.body.uniqueid;
    if (!isEmptyStr(uuid)) return tw(res, 400, '请选择加功德的人');
    let sql = `update lifebook set yang = yang + 1 where uuid = '${uuid}'`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        tw(res, 200, '加功德成功');
    })
})


//导出生死图片
router.post('/lifebook/export', async (req, res) => {
    let inner = req.body.inner;
    if (!isEmptyStr(inner)) return tw(res, 400, '请选择要导出的生死簿');
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // 设置页面视口大小
        await page.setViewport({ width: 1339, height: 855 });

        // 读取背景图片并转换为base64编码的数据URL
        const backgroundImagePath = path.join(__dirname, '../public/def/lifebook_bg.png');
        const backgroundImageData = fs.readFileSync(backgroundImagePath);
        const backgroundImageDataURL = `data:image/png;base64,${backgroundImageData.toString('base64')}`;

        // 加载包含div的HTML内容到页面中
        const htmlContent = `
      <html>
      <head>
        <style>
          .imgbox {
            width: 1339.2px;
            height: 855px;
            background-image: url(${backgroundImageDataURL});
            background-size: 100% 100%;
            padding: 30px 60px;
            box-sizing: border-box;
            padding-bottom: 63px;
          }

          .inner {
            font-family: '华文隶书 Bold', '华文隶书';
            font-weight: 700;
            font-style: normal;
            font-size: 28px;
            color: rgba(0, 0, 0, 0.627450980392157);
            line-height: 45px;
            writing-mode: vertical-rl;
            display: block;
            width: 100%;
            height: 100%;
            text-align: right;
            line-height: 53px;
            text-orientation: mixed;
          }
        </style>
      </head>
      <body>
        <div class="imgbox">
          <div class="inner">${inner}</div>
        </div>
      </body>
      </html>
    `;
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // 等待一段时间以确保div中的内容被渲染
        await page.waitForTimeout(1000);

        // 获取div的位置和尺寸
        const divSelector = '.imgbox';
        const divBoundingBox = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
            };
        }, divSelector);

        // 截取div的内容作为图片
        const screenshot = await page.screenshot({
            clip: {
                x: divBoundingBox.x,
                y: divBoundingBox.y,
                width: divBoundingBox.width,
                height: divBoundingBox.height,
            },
        });

        // 关闭浏览器
        await browser.close();

        // 设置HTTP响应头
        // res.setHeader('Content-Type', 'image/png');
        // res.setHeader('Content-Disposition', 'attachment; filename="exported_image.png"');
        res.set('Content-Type', 'image/png');

        // 将图片数据发送给客户端
        res.send(screenshot);
    } catch (error) {
        console.error('导出图片时出错:', error);
        tw(res, 500, '导出图片时出错')
    }
})

//获取临时授权
router.get('/user/gettempauth', (req, res) => {
    let sql = `select * from user where id = 2`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        let config = {
            username: result[0].sername,
            role: result[0].role,
            id: result[0].id
        }
        const token = jwt.sign(config, 'moyc^_^', { expiresIn: '1d' })
        res.send({
            'code': 200,
            'msg': '授权成功',
            'token': token
        })

    })
})


module.exports = router;