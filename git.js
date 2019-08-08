const cmd = require('node-cmd')
const { promisify } = require('util')

const cmd_get = promisify(cmd.get)

class Repo {
  constructor(path) {
    this.path = path || ''
  }

  async tags() {
    const response = await cmd_get(`git --git-dir "${this.path}.git" tag`)
    return response.split('\n')
  }

  async delete_tag(tag) {
    const local_delete = await cmd_get(`git --git-dir "${this.path}.git" tag -d ${tag}`)
    const remote_delete = await cmd_get(`git --git-dir "${this.path}.git" push origin :${tag}`)
    return `${local_delete}\n${remote_delete}`.trim()
  }
}

module.exports = {
  Repo
}
