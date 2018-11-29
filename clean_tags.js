'use strict'
const cmd = require('node-cmd')
const fs = require('fs')
let commander = require('commander') // TODO: const?

const promisify = f => (...args) =>
  new Promise((resolve, reject) => {
    f(...args, (err, result) => (err ? reject(err) : resolve(result)))
  });

// TODO: Submit a PR on node-cmd for `.promises`
const cmd_get = promisify(cmd.get)
const cmd_run = promisify(cmd.run)
const read_file = promisify(fs.readFile)
const write_file = promisify(fs.writeFile)

// List

const is_not_semantic = version => {
  const semantic = /^v?\d+\.\d+\.\d+$/
  return !version.match(semantic)
}

const list_tags = async params => {
  const response = await cmd_get(`git --git-dir ${params.git_path}.git tag`)
  const tags = response.split('\n').filter(is_not_semantic)
  if (params.output_file) {
    await write_file(params.output_file, tags.join('\n'))
  } else {
    console.log(JSON.stringify(tags, null, 2))
  }
}

// Delete

const delete_tag = async (git_path, tag) => {
  const local_delete = await cmd_run(`git --git-dir ${git_path}.git tag -d ${tag}`)
  const remote_delete = await cmd_get(`git --git-dir ${git_path}.git push origin :${tag}`)
  return `${local_delete}\n${remote_delete}`
}

const delete_tags = async params => {
  if (!params.input_file) {
    throw 'Input file required'
  }
  const input = await read_file(params.input_file)
  const tags = input.split('\n')
  tags.forEach(async tag => {
    await delete_tag(params.git_path, tag)
  })
}

// Commander

const list_command = async command => {
  try {
    return list_tags({
      git_path: command.parent.gitPath,
      output_file: command.outputFile
    })
  } catch (err) {
    console.log(err)
  }
}

const delete_command = async command => {
  try {
    return list_tags({
      git_path: command.parent.gitPath,
      input_file: command.inputFile
    })
  } catch (err) {
    console.log(err)
  }
}

commander
  .option('-g, --git-path <git_path>', 'Path to git repo. Defaults to current directory', '')

commander
  .command('list')
  .description('List all non-semantic tags')
  .option('-o, --output-file <output_file>', 'File to which to write output')
  .action(list_command)

commander
  .command('delete')
  .description('Delete a list of tags')
  .option('-i, --input-file <input_file>', 'File from which to read tags')
  .action(delete_command)

commander.parse(process.argv)
