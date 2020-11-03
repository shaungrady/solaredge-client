const { env: { GITHUB_WORKSPACE } } = require('process')
const { readFileSync } = require('fs')
const { version } = require(`${GITHUB_WORKSPACE}/package.json`)

const encoding = 'utf-8'

/**
 * @param github {Context}
 * @param context {Context}
 */
module.exports = async ({ github, context }) => {
	const ownerRepo = {
		owner: context.repo.owner,
		repo: context.repo.repo,
	}

	// Prepare our release field data…
	const target_commitish = 'release/next'
	const name = version
	const tag_name = `v${version}`
	const body = readFileSync(`${GITHUB_WORKSPACE}/release/changelog.md`, { encoding })

	// Get any existing draft release…
	const { data } = await github.repos.listReleases(ownerRepo)
	const previousDraft = data.find(release =>
		release.draft === true && release.target_commitish === target_commitish
	)

	if (previousDraft) {
		return await github.repos.updateRelease({
			...ownerRepo,
			release_id: previousDraft.id,
			name,
			tag_name,
			body,
		})
	} else {
		return await github.repos.createRelease({
			...ownerRepo,
			draft: true,
			target_commitish,
			name,
			tag_name,
			body
		})
	}
}
