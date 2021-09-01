import { DefaultRequestBody, RequestParams, RestRequest, rest } from 'msw'

import inverterTechnicalData from './responses/inverterTechnicalData.json'
import siteEnergy from './responses/siteEnergy.json'
import sitePower from './responses/sitePower.json'
import sitesList from './responses/sitesList.json'

export const apiCalls = {
	callsSet: new Set<RestRequest<DefaultRequestBody, RequestParams>>(),

	clear() {
		this.callsSet.clear()
	},

	get all() {
		return [...this.callsSet]
	},

	get first() {
		return [...this.callsSet].shift()
	},

	get last() {
		return [...this.callsSet].pop()
	},
}

export const handlers = [
	rest.get('https://localhost/sites/list', (req, res, ctx) => {
		apiCalls.callsSet.add(req)
		return res(ctx.status(200), ctx.json(sitesList))
	}),

	rest.get('https://localhost/site/:siteId/energy', (req, res, ctx) => {
		apiCalls.callsSet.add(req)
		return res(ctx.status(200), ctx.json(siteEnergy))
	}),

	rest.get('https://localhost/site/:siteId/power', (req, res, ctx) => {
		apiCalls.callsSet.add(req)
		return res(ctx.status(200), ctx.json(sitePower))
	}),

	rest.get(
		'https://localhost/equipment/:siteId/:inverterSn/data',
		(req, res, ctx) => {
			apiCalls.callsSet.add(req)
			return res(ctx.status(200), ctx.json(inverterTechnicalData))
		}
	),

	rest.get('https://localhost/DEBUG', (req, res, ctx) => {
		apiCalls.callsSet.add(req)
		return res(
			ctx.status(200),
			ctx.json({
				foo: 'bar',
				bar: 'baz',
			})
		)
	}),

	rest.get('**', (req, res, ctx) => {
		apiCalls.callsSet.add(req)
		return res(ctx.status(200), ctx.json({ String: 'Invalid' }))
	}),
]
