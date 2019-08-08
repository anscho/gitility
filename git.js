const cmd = require('node-cmd')
const { promisify } = require('util')

const cmd_get = promisify(cmd.get)
const cmd_run = promisify(cmd.run)

class Repo {
  constructor(path) {
    this.path = path || ''
  }

  async tags() {
    const response = await cmd_get(`git --git-dir "${this.path}.git" tag`)
    return response.split('\n')
  }

  async delete_tag(tag) {
    console.log('1')
    const local_delete = await cmd_run(`git --git-dir "${this.path}.git" tag -d ${tag}`)
    console.log('2')
    const remote_delete = await cmd_get(`git --git-dir "${this.path}.git" push origin :${tag}`)
    console.log('3')
    return `${local_delete}\n${remote_delete}`
  }
}

module.exports = {
  Repo
}
