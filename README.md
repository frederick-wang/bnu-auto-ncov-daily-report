# bnu-auto-ncov-daily-report

本程序可以自动完成北师大每天的打卡（地点为上一次打卡的地点）。

在服务器上用任意方式创建定时任务，用 `node` 执行 `index.js` 即可。

## 依赖安装

推荐使用 `pnpm` 作为包管理器完成依赖安装，执行 `pnpm install` 即可。

如果包管理器使用 `npm` 也可以，执行 `npm install` 即可。

如果包管理器使用 `yarn` 也可以，执行 `yarn install` 即可。

## 使用说明

1. 保证之前至少已经完成过一次手动打卡。
2. 将 `config.sample.json` 复制一份并命名为 `config.json`。
3. 填写 `config.json` 的三个字段：`username`，`password`。
4. 在服务器设置定时任务，用 `node` 执行 `index.js`。

## 配置文件字段说明

### username
填入学号。

### password
填入数字京师的密码。
