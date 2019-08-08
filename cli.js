'use strict'

const minimist = require('minimist') // TODO: const?

const cli_utils = require('./cli-utils')
const list_tags = require('./commands/list_tags')
const delete_tags = require('./commands/delete_tags')

// TODO: Support piping https://www.sitepoint.com/basics-node-js-streams/

const command = new cli_utils.NestedCommand({
  name: 'gitility',
  description: 'Automation utilities for git',
  commands: [
    list_tags,
    delete_tags
  ]
})

command.run(minimist(process.argv.slice(2)))
