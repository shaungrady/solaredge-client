import { List } from '../api.types'
import { SiteDetails } from '../site/site.types'
import SolaredgeApi from '../api.class'
import SolaredgeSite from '../site/site.class'

export default class SolaredgeAccount extends SolaredgeApi {
  constructor(public readonly apiKey: string) {
    super(apiKey)
  }

  // TODO: Add params
  async fetchSites(): Promise<SolaredgeSite[]> {
    const { apiKey } = this
    return this.callApi<List<SiteDetails>>(
      '/sites/list'
    ).then((data: List<SiteDetails>) =>
      data.list.map((site) =>
        new SolaredgeSite(apiKey, site.id).deserializeDetails(site)
      )
    )
  }
}
