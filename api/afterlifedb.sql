-- 创建可登录用户表
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  `role` int NOT NULL comment '用户角色id',
  `status` int NOT NULL comment '用户状态，0表示正常，1表示禁用',
  PRIMARY KEY (`id`)
);
-- 初始化默认数据
INSERT INTO `user` (`id`, `username`, `password`, `nickname`, `create_time`, `update_time`, `role`,`status`) 
VALUES (1, 'admin', 'e50de14051afd6aacd8d1560f2f08579', '管理员', NOW(), NOW(), 1,0);
INSERT INTO `user` (`id`, `username`, `password`, `nickname`, `create_time`, `update_time`, `role`,`status`) 
VALUES (2, '000000', 'e50de14051afd6aacd8d1560f2f08579', '授权管理员', NOW(), NOW(), 5,0);

-- 创建角色表
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(255),
  `module` varchar(255) NOT NULL comment '模块id，使用逗号分隔,all表示所有模块',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

-- 初始化默认数据，时间为当前时间
INSERT INTO `role` (`id`, `name`, `description`, `module`, `create_time`, `update_time`) 
VALUES (1, '最高管理员', '拥有所有权限', 'all', NOW(), NOW());
INSERT INTO `role` (`id`, `name`, `description`, `module`, `create_time`, `update_time`) 
VALUES (2, '勾魂使者', '拥有勾魂相关权限', '1,2,3,4,5,6,7,8,9,11,13,15,17,27,29', NOW(), NOW());
INSERT INTO `role` (`id`, `name`, `description`, `module`, `create_time`, `update_time`) 
VALUES (3, '审判长', '拥有审判相关权限', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,27,29', NOW(), NOW());
INSERT INTO `role` (`id`, `name`, `description`, `module`, `create_time`, `update_time`) 
VALUES (4, '管理员', '普通管理员', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,27,28,29', NOW(), NOW());
INSERT INTO `role` (`id`, `name`, `description`, `module`, `create_time`, `update_time`) 
VALUES (5, '授权管理员', '负责前台获取授权的账号，不要删除', '1,2,3,7,8,11,13,15,16,27,29', NOW(), NOW());

-- 创建功能模块表
CREATE TABLE `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `icon` varchar(255),
  `path` varchar(255) NOT NULL,
  `isparent` int(11) NOT NULL comment '是否为父模块，0表示否，1表示是',
  `parentid` int(11) comment '父模块id',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
);
-- -- -- -- -- -- -- -- -- -- -- -- 初始化模块数据
-- 生死簿模块
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (1, '生死簿', 'el-icon-s-order', '/lifebook', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (2, '数据管理', '', '/lifebook/data', 0, 1, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (3, '数据同步', '', '/lifebook/dataAdd', 0, 1, NOW(), NOW());
-- 勾魂模块
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (4, '勾魂管理', 'el-icon-s-finance', '/reaper', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (5, '勾魂使者', '', '/reaper/reaper', 0, 4, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (6, '勾魂数据', '', '/reaper/enchantData', 0, 4, NOW(), NOW());
-- 审判模块
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (7, '阎王殿审判', 'el-icon-video-camera-solid', '/trial', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (8, '十殿', '', '/trial/flowpath', 0, 7, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (9, '审判记录', '', '/trial/data', 0, 7, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (10, '数据同步', '', '/trial/add', 0, 7, NOW(), NOW());
-- 十八层地狱模块
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (11, '十八层地狱', 'el-icon-s-goods', '/hell', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (12, '设备管理', '', '/hell/device', 0, 11, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (13, '作业流程', '', '/hell/flowpath', 0, 11, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (14, '地狱数据', '', '/hell/data', 0, 11, NOW(), NOW());
-- 六道轮回模块
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (15, '六道轮回', 'el-icon-s-promotion', '/samsara', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (16, '轮回盘', '', '/samsara/selection', 0, 15, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (17, '轮回记录', '', '/samsara/data', 0, 15, NOW(), NOW());
-- 冥币管理
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (18, '冥币管理', 'el-icon-s-check', '/money', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (19, '汇款', '', '/money/remittance', 0, 18, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (20, '汇款管理', '', '/money/admin', 0, 18, NOW(), NOW());
-- 角色权限
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (21, '角色权限', 'el-icon-menu', '/role', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (22, '角色管理', '', '/role/role', 0, 21, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (23, '权限设置', '', '/role/authority', 0, 21, NOW(), NOW());
-- 管理员
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (24, '管理员', 'el-icon-s-custom', '/admin', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (25, '管理员管理', '', '/admin/admin', 0, 24, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (26, '管理员添加', '', '/admin/add', 0, 24, NOW(), NOW());
-- 系统设置
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (27, '系统设置', 'el-icon-s-tools', '/system', 1, 0, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (28, '系统设置', '', '/system/system', 0, 27, NOW(), NOW());
INSERT INTO `module` (`id`, `name`, `icon`, `path`, `isparent`, `parentid`, `create_time`, `update_time`)
VALUES (29, '信息修改', '', '/system/setInfo', 0, 27, NOW(), NOW());



-- 创建生死簿表
CREATE TABLE `lifebook` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(32) NOT NULL,
    `uuid` varchar(32) NOT NULL, -- 唯一标识
    `year` varchar(24) NOT NULL comment '生辰八字',
    `status` int(11) NOT NULL comment '状态，0表示未出生，1在世，2在地府生活，3轮回中，4受刑中',
    `birthday` datetime NOT NULL comment '出生日期',
    `deathday` datetime NOT NULL comment '死亡日期',
    `gender` int(11) NOT NULL comment '性别，0表示男，1表示女',
    `birthplace` varchar(500) NOT NULL,   -- 出生地址
    `deathplace` varchar(500) NOT NULL,    -- 死亡地址
    `photo` varchar(255) default '/public/def/photo.jpeg',    -- 照片
    `money` int(11) NOT NULL default 0,    -- 命中财的数量
    `yinmoney` int(11) NOT NULL default 0,    -- 死后阴财的数量
    `child` int(11) NOT NULL default 0,    -- 命中子的数量
    `longevity` int(11) NOT NULL default 0,    -- 寿元
    `type` int(11) NOT NULL comment '死亡类型，0表示自然死亡，1表示意外死亡',    -- 死亡类型
    `reason` text(2000),    -- 死因
    `marriage` text(2000) NOT NULL comment '婚配情况描述',    -- 婚配情况
    `event` text(2000) NOT NULL comment '人生大事描述',    -- 人生大事
    `attribute` text(2000) NOT NULL comment '人物属性描述',    -- 属性
    `description` text(2000) NOT NULL comment '人生描述',    -- 人生描述
    `characterinfo` text(2000) NOT NULL comment '人物描述',
    `yin` int(11) NOT NULL default 0,    -- 阴德
    `yang` int(11) NOT NULL default 0,    -- 阳德
    `reward` text(2000) NOT NULL comment '奖赏情况',
    `afterlife` text(2000) NOT NULL comment '死后情况',
    `reincarnation` text(2000) NOT NULL comment '轮回情况',     -- 轮回情况
    `punishment` text(1000) comment '受刑情况',
    `reaperid` int(11) ,          -- 勾魂操作者id
    `judgeid` int(11) ,             -- 审判操作者id
    `punishmentid` int(11) ,    -- 受刑id
    `reincarnationid` int(11) ,    -- 轮回盘id
    `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `id` (`id`)

);

-- 勾魂使者表
CREATE TABLE `reaper` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(32) NOT NULL,
    `uuid` varchar(32) NOT NULL, -- 唯一标识
    `gender` int(11) NOT NULL comment '性别，0表示男，1表示女',
    `photo` varchar(255),    -- 照片
    `description` text(2000) NOT NULL comment '描述',    -- 描述
    `create_time` datetime NOT NULL,
    `role` int(11) NOT NULL comment '角色',
    `status` int(11) NOT NULL comment '状态，0在职，1休息，2离职',
  PRIMARY KEY (`id`)
);

-- 审判记录
CREATE TABLE `judgement` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `uuid` varchar(32) NOT NULL, -- 唯一标识
    `lifebook_id` int(11) NOT NULL comment '生死簿id',
    `reaper_id` int(11) NOT NULL comment '勾魂使者id',
    `judge_id` int(11) NOT NULL comment '审判长id',
    `title` varchar(255) NOT NULL comment '标题',
    `record` text(3000) NOT NULL comment '记录',
    `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

-- 十八层地狱设备表
CREATE TABLE `helldevice` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(32) NOT NULL,
    `floor` int(11) NOT NULL comment '所在层数，1-18',
    `create_time` datetime NOT NULL,
    `status` int(11) NOT NULL comment '状态，0表示正常，1表示损坏',
  PRIMARY KEY (`id`)
);

-- 十八层地狱人员日志
CREATE TABLE `helllog` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `uid` varchar(32) NOT NULL, -- 用户id
    `floor` int(11) NOT NULL comment '所在层数，1-18',    -- 所在层数
    `device` int(11) NOT NULL comment '受刑设备id',    -- 受刑设备
    `time` varchar(100) NOT NULL,    -- 受刑时间
    `reason` text(2000) NOT NULL,    -- 受刑理由
    `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

-- 轮回盘使用日志
CREATE TABLE `reincarnationlog` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `aid` varchar(32) NOT NULL, -- 使用者id
    `uid` varchar(32) NOT NULL, -- 被使用者id
    `type` varchar(32) NOT NULL comment '结果',
    `reason` text(2000) NOT NULL,    -- 轮回理由
    `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

-- 汇款表
CREATE TABLE `remittance` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `relationship` varchar(32) NOT NULL, -- 汇款人关系
    `uid` varchar(32) NOT NULL, -- 收款人id
    `money` int(11) NOT NULL comment '金额',
    `reason` text(2000) NOT NULL,    -- 汇款理由
    `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

-- 系统设置
CREATE TABLE `setting` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `key` varchar(32) NOT NULL, -- 键
    `value` varchar(32) NOT NULL, -- 值,0表示关闭，1表示开启
    `create_time` datetime NOT NULL,
    `remark` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

-- 初始化系统设置
INSERT INTO `setting` (`key`, `value`, `create_time`,`remark`) VALUES ('remittance', '1', NOW(),'汇款开关'); -- 开启汇款
INSERT INTO `setting` (`key`, `value`, `create_time`,`remark`) VALUES ('woodenfish', '1', NOW(),'敲木鱼加功德开关'); -- 开启敲木鱼加阳德