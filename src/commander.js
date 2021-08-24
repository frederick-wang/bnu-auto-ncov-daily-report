const { Command } = require('commander')
const { PACKAGE_JSON_PATH } = require('../env')
const { version } = require(PACKAGE_JSON_PATH)

const program = new Command()
program.version(version)
program
  .option('-u, --username <username>', '数字京师用户名')
  .option('-p, --password <password>', '数字京师密码')
  .option('-m, --mail <boolean>', '是否开启邮件通知功能')
  .option('-h, --mail_host <host>', 'SMTP 服务器')
  .option('-o, --mail_port <port>', 'SMTP 服务器端口')
  .option('-s, --mail_secure <boolean>', 'SMTP 服务器端口是否加密')
  .option('-U, --mail_user <mail_uesrname>', 'SMTP 服务器登录用户名')
  .option('-P, --mail_pass <mail_password>', 'SMTP 服务器登录密码')
  .option('-t, --mail_to <receiver>', '邮件通知的收件人邮箱')
program.parse(process.argv)

exports.options = program.opts()
