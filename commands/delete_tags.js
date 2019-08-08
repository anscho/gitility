// Delete a list of tags
'use strict'
const fs = require('fs')

const cli_utils = require('../cli-utils')
const { Repo } = require('../git')

// Functions

// Returns a list of tags from a file
// TODO: Piping
const read_tags = file_path => {
  if (file_path) {
    const input = fs.readFileSync(file_path, 'utf8')
    return input.split('\n')
  } else {
    throw new Error('Input file required')
  }
}

// CLI

const name = 'delete'
const description = 'Delete a list of tags'

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
    const tags = read_tags(file_path)
    const repo = new Repo(git_path)

    console.log(`Deleting ${tags.length} tags...`)

    for (let i = 0; i < tags.length; i++) {
      console.log(await repo.delete_tag(tags[i]))
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
