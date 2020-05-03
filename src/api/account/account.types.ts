import { SiteStatus, SortOrder } from '../api.types.js'
import { SiteDetails } from '../site/site.types.js'

export interface SitesParams {
  // The maximum number of sites returned by this call. The
  // maximum number of sites that can be returned by this
  // call is 100. If you have more than 100 sites, just request
  // another 100 sites with startIndex=100. This will fetch sites
  // 100-199.
  size?: number
  // The first site index to be returned in the results
  startIndex?: number
  searchText?: string
  sortProperty?: SiteSortProperty
  sortOrder?: SortOrder
  status?: SiteStatus
}

export interface AccountSites {
  count: number
  site: SiteDetails[]
}

export enum SiteSortProperty {
  Name = 'Name',
  Country = 'Country',
  State = 'State',
  City = 'City',
  Address = 'Address',
  Zip = 'Zip',
  Status = 'Status',
  PeakPower = 'PeakPower',
  InstallationDate = 'InstallationDate',
  // sort by amount of alerts
  Amount = 'Amount',
  // sort by alert severity
  MaxSeverity = 'MaxSeverity',
  CreationTime = 'CreationTime',
}
