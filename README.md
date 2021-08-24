# 北师大打卡助手

本程序可以自动完成北师大每天的打卡（地点为上一次打卡的地点）。

## 依赖安装

> 在安装依赖前，首先确保 `Node.js` 版本不低于 `12`。

推荐使用 `pnpm` 作为包管理器完成依赖安装，执行 `pnpm install` 即可。

如果包管理器使用 `npm` 也可以，执行 `npm install` 即可。

如果包管理器使用 `yarn` 也可以，执行 `yarn install` 即可。

## 使用说明

### Github Actions（推荐）

1. Fork 本仓库。
2. 进入仓库的 Settings 页面，在左侧的菜单中选择 Secrets，点击「New repository secret」按钮，新建 3 个 Actions secrets：
  - **USERNAME**：填写学号
  - **PASSWORD**：填写密码
  - **MAIL**：填写邮件配置（如果需要），内容同「命令行参数说明」一节中的 `--mail` 参数，为一个 JSON 字符串。

之后，就会在北京时间每天 00:05 自动打卡了（Github Actions 可能有一定的延迟），如果配置了邮件提醒，还会自动发送邮件到你的邮箱。

如果希望在其他时间打卡，可以在 `.github/workflows/bot.yml` 中，修改 `cron` 为你需要的时间。

### 个人服务器部署

首先，保证之前至少已经完成过一次手动打卡。

如果使用配置文件方式输入参数，则需要：

1. 将 `config.sample.json` 复制一份并命名为 `config.json`。
2. 填写 `config.json` 的属性 `username` 和 `password`。如果需要如果需要开启邮件提醒功能，则还需按照「配置文件说明」一节填写 `mail` 属性。
3. 在服务器上用任意方式创建定时任务，用 `node` 执行 `app.js`。

如果使用命令行方式输入参数，则需要：

- 在服务器上用任意方式创建定时任务，用 `node` 执行 `app.js`，并按照「命令行参数说明」一节填写调用参数。

配置文件与命令行参数可以混用，如果出现参数同名情况，命令行输入的参数优先级更高。

## 命令行参数说明

```bash
Usage: node app [options]

Options:
  -V, --version              output the version number
  -u, --username <username>  数字京师用户名
  -p, --password <password>  数字京师密码
  -m, --mail [options]       邮件配置对象
  -h, --help                 display help for command
```

其中，`--mail` 参数默认为空，如果不需要开启邮件提醒功能，不使用该参数即可，如：

```bash
node app -u 用户名 -p 密码
```

如果需要开启邮件提醒功能，需要设置 SMTP 服务器与邮件模板信息。`--mail` 参数为一个 JSON 字符串，调用示例如下: 

```bash
node app -u 用户名 -p 密码 -m '{"transport": {"host": "这里填入 SMTP 服务器，比如可以用 QQ 的SMTP服务器","port": 465,"secure": true,"auth": {"user": "邮箱名","pass": "密码"}},"info": {"from": "北师大打卡助手 <邮箱名>","to": "输入接收通知邮件的邮箱","subject": "[北师大打卡助手] \${date} 自动打卡记录","html": "<p>学号为 \${username} 的用户：</p><p>您的今日打卡结果为：<strong>\${result}</strong>。</p><p>系统提示为：「\${message}」。</p><p>打卡时间为：\${date} \${time}。</p><br><p>北师大打卡助手</p><p>Powered by Zhaoji Wang</p>"}}'
```

## 配置文件说明

### username （必填）
填入学号。

### password （必填）
填入数字京师的密码。

### mail （非必填）

如果不需要开启邮件提醒功能，保持 `mail` 属性为 `null` 即可。

如果需要开启邮件提醒功能，需要设置 SMTP 服务器与邮件模板信息。示例如下: 

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
      "from": "北师大打卡助手 <邮箱名>",
      "to": "输入接收通知邮件的邮箱",
      "subject": "[北师大打卡助手] ${date} 自动打卡记录",
      "html": "<p>学号为 ${username} 的用户：</p><p>您的今日打卡结果为：<strong>${result}</strong>。</p><p>系统提示为：「${message}」。</p><p>打卡时间为：${date} ${time}。</p><br><p>北师大打卡助手</p><p>Powered by Zhaoji Wang</p>"
    }
  }
}
```
