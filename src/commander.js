const { Command } = require('commander')
const { PACKAGE_JSON_PATH } = require('../env')
const { version } = require(PACKAGE_JSON_PATH)

const program = new Command()
program.version(version)
program
  .requiredOption('-u, --username <username>', '数字京师用户名')
  .requiredOption('-p, --password <password>', '数字京师密码')
  .option('-m, --mail [options]', '邮件配置对象')
program.parse(process.argv)

exports.options = program.opts()
