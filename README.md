# bnu-auto-ncov-daily-report

本程序可以自动完成北师大每天的打卡（地点为上一次打卡的地点）。

在服务器上用任意方式创建定时任务，用 `node` 执行 `app.js` 即可。

## 依赖安装

> 在安装依赖前，首先确保 `Node.js` 版本不低于 `12`。

推荐使用 `pnpm` 作为包管理器完成依赖安装，执行 `pnpm install` 即可。

如果包管理器使用 `npm` 也可以，执行 `npm install` 即可。

如果包管理器使用 `yarn` 也可以，执行 `yarn install` 即可。

## 使用说明

1. 保证之前至少已经完成过一次手动打卡。
2. 将 `config.sample.json` 复制一份并命名为 `config.json`。
3. 填写 `config.json` 的 2 个字段：`username`，`password`。
4. 在服务器设置定时任务，用 `node` 执行 `app.js`。

## 配置文件字段说明

### username （必填）
填入学号。

### password （必填）
填入数字京师的密码。

### mail （非必填）

如果不需要开启邮件提醒功能，保持 `mail` 字段为 `null` 即可。

如果需要开启邮件提醒功能，需要设置 SMTP 服务器与邮件模板信息。示例如下：

```json
{
  "mail": {
    "transport": {
      "host": "这里填入 SMTP 服务器，比如可以用 QQ 的SMTP服务器",
      "port": 465,
      "secure": true,
      "auth": {
        "user": "邮箱名",
        "pass": "密码"
      }
    },
    "info": {
      "from": "\"北师大打卡助手\" <邮箱名>",
      "to": "输入接收通知邮件的邮箱",
      "subject": "[北师大打卡助手] ${date} 自动打卡记录",
      "html": "<p>学号为 ${username} 的用户：</p><p>您的今日打卡结果为：<strong>${result}</strong>。</p><p>系统提示为：「${message}」。</p><p>打卡时间为：${date} ${time}。</p><br><p>北师大打卡助手</p><p>Powered by Zhaoji Wang</p>"
    }
  }
}
```
