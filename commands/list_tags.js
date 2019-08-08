// Simplest sub-command, to get a monitor from the API
'use strict'
const fs = require('fs')

const cli_utils = require('../cli-utils')
const { Repo } = require('../git')

// Functions

const is_not_semantic = version => {
  const semantic = /^v?\d+(\.\d+)*(-(.{7}))?$/
  return !version.match(semantic)
}

// CLI

const name = 'list'
const description = 'List non-semantic tags'

const help = () => {
  console.log(`Usage: ${name} [-g git-path] [-f file-path]

  ${description}
`)
}

const run = async argv => {
  if (cli_utils.is_help(argv)) {
    help()
    process.exit()
  }

  const {
    g: git_path,
    f: file_path
  } = argv

  try {
    const repo = new Repo(git_path)
    const tags = (await repo.tags()).filter(is_not_semantic)
    if (file_path) {
      fs.writeFileSync(file_path, tags.join('\n'))
    } else {
      console.log(tags.join('\n'))
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  description,
  help,
  name,
  run
}
