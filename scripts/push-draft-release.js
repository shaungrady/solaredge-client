/**
 * This script should be run in a GitHub Workflow.
 *
 * Steps taken by this script.
 * 1. Write `release/draft-changelog.md` for publish script to consume.
 * 2. Create release commit with bumped version and updated CHANGELOG.md.
 * 3. Force push release commit to origin `release/next`.
 */

const fs = require('fs')
const execSync = require('child_process').execSync
const encoding = 'utf-8'

console.log('Generating release changelog…')

const dryRunOutput = execSync('standard-version --skip.commit --skip.tag --dry-run', { encoding })
const [,changelog] = dryRunOutput.split(/\s+---\s+/g);

if (!fs.existsSync('./release')) {
	fs.mkdirSync('./release')
}

fs.writeFileSync('./release/changelog.md', changelog, { encoding })

console.group()
console.log(changelog + '\n')
console.groupEnd()

console.log('Creating release commit…')
execSync('standard-version --skip.tag', { encoding })

console.log(`Pushing release commit to 'release/next'…`)
execSync('git push --force origin HEAD:release/next', { encoding })
