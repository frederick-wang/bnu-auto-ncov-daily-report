# bnu-auto-ncov-daily-report

本程序可以自动完成北师大每天的打卡，在服务器上用任意方式创建定时任务，用 `node` 执行 `index.js` 即可。

## 使用说明

1. 保证之前至少已经完成过一次手动打卡。
2. 将 `config.sample.json` 复制一份并命名为 `config.json`。
3. 填写 `config.json` 的三个字段：`username`，`password`，`geo_api_info`
4. 在服务器设置定时任务，用 `node` 执行 `index.js`

## 配置文件字段说明

### username
填入学号。

### password
填入数字京师的密码。

### geo_api_info
该字段为打卡地点信息，先手动获取，然后填入即可，获取方法如下。

首先，使用浏览器访问 `https://onewechat.bnu.edu.cn/ncov/wap/default/index`。

打开页面后，完成登录，进入打卡页面。

然后点击「获取地理位置」，等待地理位置获取成功。（谷歌 Chrome 浏览器可能会获取失败，建议使用微软 New Edge 浏览器）

按 `F12` 键打开开发者工具，切换到 `Console（控制台）`，执行：

```js
console.log(vm.info.geo_api_info)
```

然后便可得到 `geo_api_info` 数据，将其复制粘贴为 `config.json` 的 `geo_api_info` 属性即可。
