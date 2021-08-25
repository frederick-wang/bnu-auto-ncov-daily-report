# 北师大每日上报打卡助手

本程序可以自动完成北师大的疫情防控每日健康状况上报打卡。只要之前至少打卡过一次，即可自动读取上一次打卡的数据完成打卡（地点为上一次打卡的地点）。

支持三种使用方式：

1. fork 仓库后，配置好仓库的 Secrets 作为输入参数，通过 Github Actions 直接在线使用。**（推荐）**
2. 部署在服务器上运行，可以通过命令行参数或配置文件两种方式输入参数，通过任意方式创建计划任务即可。
3. 在本地电脑上运行，可以通过命令行参数或配置文件两种方式输入参数，通过任意方式创建计划任务即可。**（不推荐）**

程序运行后，支持通过微信消息、电子邮件两种方式通知用户打卡结果。如果打卡失败，还支持读取打卡页面上的弹窗提示通知用户。

**声明：本程序仅供学习 Web 技术知识，交流计算机研究心得使用，如有身体不适、位置移动、接触患者等意外情况，请务必如实手动打卡。**

## 使用说明

### Github Actions（推荐）

#### 基础教程

1. Fork 本仓库。
2. 进入仓库的 Settings 页面，在左侧的菜单中选择 Secrets，点击「New repository secret」按钮，新建下面这些 Secrets（冒号前的是 Secret Name，冒号后的是要填的内容）：
  - **USERNAME**: 填写学号（必须设置）
  - **PASSWORD**: 填写数字京师密码（必须设置）
  - **WECHAT**: 是否开启微信通知功能，`true` 为开启，`false` 为不开启（如果不开启，也可以直接不设置）
  - **WECHAT_SENDKEY**: 「Server酱」微信消息推送服务的 SendKey（只在开启微信通知功能时需要设置）
  - **MAIL**: 是否开启邮件通知功能，`true` 为开启，`false` 为不开启（如果不开启，也可以直接不设置）
  - **MAIL_HOST**: SMTP 服务器（只在开启邮件通知功能时需要设置）
  - **MAIL_PORT**: SMTP 服务器端口，填数字（只在开启邮件通知功能时需要设置）
  - **MAIL_SECURE**: SMTP 服务器端口是否加密，`true` 为加密，`false` 为不加密（只在开启邮件通知功能时需要设置）
  - **MAIL_USER**: SMTP 服务器登录用户名（只在开启邮件通知功能时需要设置）
  - **MAIL_PASS**: SMTP 服务器登录密码（只在开启邮件通知功能时需要设置）
  - **MAIL_TO**: 邮件通知的收件人邮箱（只在开启邮件通知功能时需要设置）
3. 进入仓库的 Actions 界面，开启 Workflows，然后选择 `Report Bot` workflow，enable workflow

配置好 Secrets 并启用 workflow 后，推荐先手动运行一次该 workflow，看看运行是否正常，能不能收到通知等。（如下图）

![image](https://user-images.githubusercontent.com/6050869/130862690-66862b5f-8bf8-4568-b907-34431f6eabae.png)

如果配置成功的话，该 workflow 就会在北京时间每天 00:05 自动执行，完成打卡了（Github Actions 可能有最长 15 分钟左右的延迟，最晚会在 00:20 左右自动执行）。

注：邮件通知功能与微信通知功能可以同时开启，也可以只开启其中一个，也可以都不开启。

#### 自定义打卡时间

如果希望在其他时间打卡，可以在 `.github/workflows/bot.yml` 中，修改 `cron` 为你需要的时间。

#### 开启微信通知功能

本程序的微信通知功能依赖于「Server酱」微信消息推送服务。如果希望使用，需要前往「Server酱」网站（[https://sct.ftqq.com/](https://sct.ftqq.com/)）注册一个账号，并获取 `SendKey`。

第一步，进入「Server酱」网站，点击右上角「登入」，然后使用微信扫码，将自动注册账号并登录。

![image](https://user-images.githubusercontent.com/6050869/130860816-2e2842d2-72c9-4a1c-a88e-d5296e27bd76.png)

第二步，在 SendKey 页面中，点击「复制」按钮，复制 `SendKey`。

![image](https://user-images.githubusercontent.com/6050869/130861195-76abfc41-4131-4a15-bc25-79cdfcfa2fd7.png)

也可以先点击那个闭着的眼睛按钮，显示 `SendKey`，之后手动复制。

![image](https://user-images.githubusercontent.com/6050869/130861541-8e5b9831-2337-4ee4-a5cf-62659d4afcb4.png)

然后，在设置好 `USERNAME` 与 `PASSWORD` 之后，额外设置下列 Secrets：

  - **WECHAT**: true
  - **WECHAT_SENDKEY**: 把刚才复制的「Server酱」微信消息推送服务的 SendKey 粘贴到这里

#### 开启邮件通知功能（以 QQ 邮箱为例）

国内最常见的邮箱服务是 QQ 邮箱，下面以 QQ 邮箱为例，说明如何配置邮件通知。

第一步，进入 QQ 邮箱，点「设置」，切换到「账户」选项卡（如下图）。
![image](https://user-images.githubusercontent.com/6050869/130831671-ca586492-064e-42b9-8daa-8edf6f8f23a6.png)

第二步，滚动页面到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」一节，确认 SMTP 服务已开启，如果没有开启，手动打开。

![image](https://user-images.githubusercontent.com/6050869/130831106-10e4f104-8b83-4429-8db2-64264cef793e.png)

第三步，点击「生成授权码」，生成登录 SMTP 服务器所需的独立密码。

![image](https://user-images.githubusercontent.com/6050869/130831217-e6978a23-e6af-4825-8269-1e0e308a145a.png)

然后，在设置好 `USERNAME` 与 `PASSWORD` 之后，额外设置下列 Secrets：

  - **MAIL**: true
  - **MAIL_HOST**: smtp.qq.com
  - **MAIL_PORT**: 465
  - **MAIL_SECURE**: true
  - **MAIL_USER**: QQ 邮箱的完整邮件地址
  - **MAIL_PASS**: 在第三步中生成的授权码
  - **MAIL_TO**: 你需要接收通知的邮箱，可以继续填自己的 QQ 邮箱

配置好邮件通知后，每天打卡完毕将自动发送邮件到你的邮箱（如下图）。

![image](https://user-images.githubusercontent.com/6050869/130831490-d90630c6-3d18-4c8b-b228-18a8b542556d.png)

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
2. 填写 `config.json` 的属性 `username` 和 `password`。如果需要如果需要开启邮件通知、微信通知等功能，则还需按照「配置文件说明」一节填写 `mail`、`wechat` 等属性。
3. 在服务器上用任意方式创建定时任务，用 `node` 执行 `app.js`。

如果使用命令行方式输入参数，则需要：

- 在服务器上用任意方式创建定时任务，用 `node` 执行 `app.js`，并按照「命令行参数说明」一节填写调用参数。

配置文件与命令行参数可以混用，如果出现参数同名情况，命令行输入的参数优先级更高。

#### 命令行参数说明

```bash
Usage: node app [options]

Options:
  -V, --version                    output the version number
  -u, --username <username>        数字京师用户名
  -p, --password <password>        数字京师密码
  -m, --mail <boolean>             是否开启邮件通知功能
  -h, --mail_host <host>           SMTP 服务器
  -o, --mail_port <port>           SMTP 服务器端口
  -s, --mail_secure <boolean>      SMTP 服务器端口是否加密
  -U, --mail_user <mail_uesrname>  SMTP 服务器登录用户名
  -P, --mail_pass <mail_password>  SMTP 服务器登录密码
  -t, --mail_to <receiver>         邮件通知的收件人邮箱
  -w, --wechat <boolean>           是否开启微信通知功能（依赖「Server酱」微信消息推送服务）
  -k, --wechat_sendkey <sendkey>   「Server酱」微信消息推送服务的 SendKey
  --help                           display help for command
```

其中，`--mail` 参数默认为 `false`，如果不需要开启邮件通知功能，不使用该参数即可，如：

```bash
node app -u 数字京师用户名 -p 数字京师密码
```

如果需要开启邮件通知功能，需要设置 SMTP 服务器与邮件模板信息，以前文提到的 QQ 邮箱为例，调用示例如下: 

```bash
node app -u 数字京师用户名 -p 数字京师密码 -m true -h smtp.qq.com -o 465 -s true -U QQ邮箱 -P QQ邮箱授权码 -t 邮件通知的收件人邮箱
```

如果需要开启微信通知功能，由于本程序的微信通知功能依赖于[「Server酱」微信消息推送服务](https://sct.ftqq.com/)，需要首先去[「Server酱」微信消息推送服务](https://sct.ftqq.com/)的网站注册一个账号，注册后获取 `SendKey`。调用示例如下: 

```bash
node app -u 数字京师用户名 -p 数字京师密码 -w true -k 「Server酱」的SendKey
```

邮件通知功能和微信通知功能可以同时开启，调用示例如下：

```bash
node app -u 数字京师用户名 -p 数字京师密码 -m true -h smtp.qq.com -o 465 -s true -U QQ邮箱 -P QQ邮箱授权码 -t 邮件通知的收件人邮箱 -w true -k 「Server酱」的SendKey
```

#### 配置文件说明

##### username （必填）
填入学号。

##### password （必填）
填入数字京师的密码。

##### mail （非必填）

如果不需要开启邮件通知功能，保持 `mail` 属性为 `false` 即可。

如果需要开启邮件通知功能，除了将 `mail` 设置为 `true`，还需要设置 SMTP 服务器与收件邮箱信息。示例如下: 

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
  "mail_to": "邮件通知的收件人邮箱",
  "wechat": "是否开启微信通知功能（依赖「Server酱」微信消息推送服务）",
  "wechat_sendkay": "「Server酱」微信消息推送服务的 SendKey"
}
```

##### wechat （非必填）

如果不需要开启微信通知功能，保持 `wechat` 属性为 `false` 即可。

如果需要开启微信通知功能，除了将 `wechat` 设置为 `true`，还需要设置「Server酱」微信消息推送服务的 SendKey。示例如下: 

```json
{
  "username": "填入学号",
  "password": "填入数字京师的密码",
  "wechat": true,
  "wechat_sendkay": "「Server酱」微信消息推送服务的 SendKey"
}
```

注：邮件通知功能与微信通知功能可以同时开启，也可以只开启其中一个，也可以都不开启。
