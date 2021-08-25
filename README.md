# 北师大打卡助手

本程序可以自动完成北师大每天的打卡（地点为上一次打卡的地点）。

## 使用说明

### Github Actions（推荐）

1. Fork 本仓库。
2. 进入仓库的 Settings 页面，在左侧的菜单中选择 Secrets，点击「New repository secret」按钮，新建下面这些 Secrets（冒号前的是 Secret Name，冒号后的是要填的内容）：
  - **USERNAME**: 填写学号（必须设置）
  - **PASSWORD**: 填写数字京师密码（必须设置）
  - **MAIL**: 是否开启邮件通知功能，`true` 为开启，`false` 为不开启（如果不开启，也可以直接不设置）
  - **MAIL_HOST**: SMTP 服务器（只在开启邮件通知功能时需要设置）
  - **MAIL_PORT**: SMTP 服务器端口，填数字（只在开启邮件通知功能时需要设置）
  - **MAIL_SECURE**: SMTP 服务器端口是否加密，`true` 为加密，`false` 为不加密（只在开启邮件通知功能时需要设置）
  - **MAIL_USER**: SMTP 服务器登录用户名（只在开启邮件通知功能时需要设置）
  - **MAIL_PASS**: SMTP 服务器登录密码（只在开启邮件通知功能时需要设置）
  - **MAIL_TO**: 邮件通知的收件人邮箱（只在开启邮件通知功能时需要设置）
3. 进入仓库的 Actions 界面，开启 Workflows，然后选择 `Report Bot` workflow，enable workflow

之后，就会在北京时间每天 00:05 自动打卡了（Github Actions 可能有 15 分钟左右的延迟），如果配置了邮件提醒，还会自动发送邮件到你的邮箱（如下图）。

![image](https://user-images.githubusercontent.com/6050869/130831490-d90630c6-3d18-4c8b-b228-18a8b542556d.png)

如果希望在其他时间打卡，可以在 `.github/workflows/bot.yml` 中，修改 `cron` 为你需要的时间。

国内最常见的邮箱服务是 QQ 邮箱，下面以 QQ 邮箱为例，说明如何配置邮件提醒。

第一步，进入 QQ 邮箱，点「设置」，切换到「账户」选项卡（如下图）。
![image](https://user-images.githubusercontent.com/6050869/130831671-ca586492-064e-42b9-8daa-8edf6f8f23a6.png)

第二步，滚动页面到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」一节，确认 SMTP 服务已开启，如果没有开启，手动打开。

![image](https://user-images.githubusercontent.com/6050869/130831106-10e4f104-8b83-4429-8db2-64264cef793e.png)

第三步，点击「生成授权码」，生成登录 SMTP 服务器所需的独立密码。

![image](https://user-images.githubusercontent.com/6050869/130831217-e6978a23-e6af-4825-8269-1e0e308a145a.png)

然后设置下列 Secrets：

  - **USERNAME**: 填写学号（必须设置）
  - **PASSWORD**: 填写数字京师密码（必须设置）
  - **MAIL**: true
  - **MAIL_HOST**: smtp.qq.com
  - **MAIL_PORT**: 465
  - **MAIL_SECURE**: true
  - **MAIL_USER**: QQ 邮箱的完整邮件地址
  - **MAIL_PASS**: 在第三步中生成的授权码
  - **MAIL_TO**: 你需要接收通知的邮箱，可以继续填自己的 QQ 邮箱

### 个人服务器部署

#### 依赖安装

> 在安装依赖前，首先确保 `Node.js` 版本不低于 `12`。

推荐使用 `pnpm` 作为包管理器完成依赖安装，执行 `pnpm install` 即可。

如果包管理器使用 `npm` 也可以，执行 `npm install` 即可。

如果包管理器使用 `yarn` 也可以，执行 `yarn install` 即可。

#### 配置参数

首先，保证之前至少已经完成过一次手动打卡。

如果使用配置文件方式输入参数，则需要：

1. 将 `config.sample.json` 复制一份并命名为 `config.json`。
2. 填写 `config.json` 的属性 `username` 和 `password`。如果需要如果需要开启邮件提醒功能，则还需按照「配置文件说明」一节填写 `mail` 等属性。
3. 在服务器上用任意方式创建定时任务，用 `node` 执行 `app.js`。

如果使用命令行方式输入参数，则需要：

- 在服务器上用任意方式创建定时任务，用 `node` 执行 `app.js`，并按照「命令行参数说明」一节填写调用参数。

配置文件与命令行参数可以混用，如果出现参数同名情况，命令行输入的参数优先级更高。

## 命令行参数说明

```bash
Usage: node app [options]

Options:
  -V, --version                    output the version number
  -u, --username <username>        数字京师用户名
  -p, --password <password>        数字京师密码
  -m, --mail <boolean>             是否开启邮件通知功能，`true` 为开启，`false` 为不开启
  -h, --mail_host <host>           SMTP 服务器
  -o, --mail_port <port>           SMTP 服务器端口
  -s, --mail_secure <boolean>      SMTP 服务器端口是否加密，`true` 为加密，`false` 为不加密
  -U, --mail_user <mail_uesrname>  SMTP 服务器登录用户名
  -P, --mail_pass <mail_password>  SMTP 服务器登录密码
  -t, --mail_to <receiver>         邮件通知的收件人邮箱
  --help                           display help for command
```

其中，`--mail` 参数默认为 `false`，如果不需要开启邮件提醒功能，不使用该参数即可，如：

```bash
node app -u 数字京师用户名 -p 数字京师密码
```

如果需要开启邮件提醒功能，需要设置 SMTP 服务器与邮件模板信息。`--mail` 参数为一个 JSON 字符串，调用示例如下: 

```bash
node app -u 数字京师用户名 -p 数字京师密码 -m -h SMTP服务器 -o SMTP服务器端口 -s -U SMTP服务器登录用户名 -P SMTP服务器登录密码 -t 邮件通知的收件人邮箱
```

## 配置文件说明

### username （必填）
填入学号。

### password （必填）
填入数字京师的密码。

### mail （非必填）

如果不需要开启邮件提醒功能，保持 `mail` 属性为 `false` 即可。

如果需要开启邮件提醒功能，除了将 `mail` 设置为 `true`，还需要设置 SMTP 服务器与收件邮箱信息。示例如下: 

```json
{
  "username": "填入学号",
  "password": "填入数字京师的密码",
  "mail": true,
  "mail_host": "SMTP 服务器",
  "mail_port": SMTP 服务器端口，填数字,
  "mail_secure": SMTP 服务器端口是否加密，true 为加密，false 为不加密,
  "mail_user": "SMTP 服务器登录用户名",
  "mail_pass": "SMTP 服务器登录密码",
  "mail_to": "邮件通知的收件人邮箱"
}
```
