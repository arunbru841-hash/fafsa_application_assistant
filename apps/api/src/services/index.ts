/**
 * API Services Index
 * 
 * Central export point for all external API services
 */

export * from './collegescorecard.service'
export * from './treasury.service'
export * from './fred.service'

import collegeScorecard from './collegescorecard.service'
import treasury from './treasury.service'
import fred from './fred.service'

export const apiServices = {
  collegeScorecard,
  treasury,
  fred,
}

export default apiServices
