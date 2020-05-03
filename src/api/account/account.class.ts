import SolaredgeApi from '../api.class.js'
import SolaredgeSite from '../site/site.class.js'
import { SiteDetails } from '../site/site.types.js'
import { AccountSites, SitesParams } from './account.types.js'

export default class SolaredgeAccount extends SolaredgeApi {
  constructor(public readonly apiKey: string) {
    super(apiKey)
  }

  async fetchSites(params: SitesParams = {}): Promise<SolaredgeSite[]> {
    const { apiKey } = this
    const data = await this.callApi<AccountSites>('/sites/list', params)
    return data.site.map((site: SiteDetails) =>
      new SolaredgeSite(apiKey, site.id).deserializeDetails(site)
    )
  }
}
