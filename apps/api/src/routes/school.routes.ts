import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { logger } from '../utils/logger'

const router = Router()

// Sample schools data (in production, this would come from a database)
// This represents a subset of the 6,000+ schools in the federal database
const schoolsData: School[] = [
  {
    id: '001002',
    name: 'University of Alabama',
    city: 'Tuscaloosa',
    state: 'AL',
    zip: '35487',
    type: 'public',
    website: 'https://www.ua.edu',
    phone: '205-348-6010',
    inStateTuition: 11580,
    outStateTuition: 31460,
    roomAndBoard: 11950,
    averageAid: 16820,
    isActive: true,
  },
  {
    id: '001312',
    name: 'Stanford University',
    city: 'Stanford',
    state: 'CA',
    zip: '94305',
    type: 'private',
    website: 'https://www.stanford.edu',
    phone: '650-723-2300',
    inStateTuition: 57693,
    outStateTuition: 57693,
    roomAndBoard: 18619,
    averageAid: 53200,
    isActive: true,
  },
  {
    id: '001305',
    name: 'Massachusetts Institute of Technology',
    city: 'Cambridge',
    state: 'MA',
    zip: '02139',
    type: 'private',
    website: 'https://www.mit.edu',
    phone: '617-253-1000',
    inStateTuition: 57986,
    outStateTuition: 57986,
    roomAndBoard: 18830,
    averageAid: 55000,
    isActive: true,
  },
  {
    id: '001316',
    name: 'University of California, Berkeley',
    city: 'Berkeley',
    state: 'CA',
    zip: '94720',
    type: 'public',
    website: 'https://www.berkeley.edu',
    phone: '510-642-6000',
    inStateTuition: 14312,
    outStateTuition: 44066,
    roomAndBoard: 20530,
    averageAid: 20870,
    isActive: true,
  },
  {
    id: '002155',
    name: 'Harvard University',
    city: 'Cambridge',
    state: 'MA',
    zip: '02138',
    type: 'private',
    website: 'https://www.harvard.edu',
    phone: '617-495-1000',
    inStateTuition: 57261,
    outStateTuition: 57261,
    roomAndBoard: 19502,
    averageAid: 60000,
    isActive: true,
  },
  {
    id: '001445',
    name: 'University of Texas at Austin',
    city: 'Austin',
    state: 'TX',
    zip: '78712',
    type: 'public',
    website: 'https://www.utexas.edu',
    phone: '512-471-3434',
    inStateTuition: 11448,
    outStateTuition: 40996,
    roomAndBoard: 12564,
    averageAid: 11500,
    isActive: true,
  },
  {
    id: '002707',
    name: 'University of Michigan',
    city: 'Ann Arbor',
    state: 'MI',
    zip: '48109',
    type: 'public',
    website: 'https://www.umich.edu',
    phone: '734-764-1817',
    inStateTuition: 16736,
    outStateTuition: 53232,
    roomAndBoard: 12936,
    averageAid: 18200,
    isActive: true,
  },
  {
    id: '001319',
    name: 'University of Southern California',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90089',
    type: 'private',
    website: 'https://www.usc.edu',
    phone: '213-740-2311',
    inStateTuition: 62707,
    outStateTuition: 62707,
    roomAndBoard: 17907,
    averageAid: 40100,
    isActive: true,
  },
  {
    id: '003005',
    name: 'New York University',
    city: 'New York',
    state: 'NY',
    zip: '10003',
    type: 'private',
    website: 'https://www.nyu.edu',
    phone: '212-998-1212',
    inStateTuition: 58168,
    outStateTuition: 58168,
    roomAndBoard: 19000,
    averageAid: 31600,
    isActive: true,
  },
  {
    id: '001350',
    name: 'UCLA',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90095',
    type: 'public',
    website: 'https://www.ucla.edu',
    phone: '310-825-4321',
    inStateTuition: 13249,
    outStateTuition: 43003,
    roomAndBoard: 17231,
    averageAid: 21300,
    isActive: true,
  },
  {
    id: '003378',
    name: 'Duke University',
    city: 'Durham',
    state: 'NC',
    zip: '27708',
    type: 'private',
    website: 'https://www.duke.edu',
    phone: '919-684-8111',
    inStateTuition: 60244,
    outStateTuition: 60244,
    roomAndBoard: 18308,
    averageAid: 55200,
    isActive: true,
  },
  {
    id: '001253',
    name: 'Georgia Institute of Technology',
    city: 'Atlanta',
    state: 'GA',
    zip: '30332',
    type: 'public',
    website: 'https://www.gatech.edu',
    phone: '404-894-2000',
    inStateTuition: 12682,
    outStateTuition: 33794,
    roomAndBoard: 11826,
    averageAid: 13300,
    isActive: true,
  },
]

// Types
interface School {
  id: string
  name: string
  city: string
  state: string
  zip: string
  type: 'public' | 'private' | 'proprietary'
  website?: string
  phone?: string
  inStateTuition: number
  outStateTuition: number
  roomAndBoard: number
  averageAid: number
  isActive: boolean
}

// Validation schemas
const searchQuerySchema = z.object({
  query: z.string().min(2).optional(),
  state: z.string().length(2).optional(),
  type: z.enum(['public', 'private', 'proprietary']).optional(),
  minTuition: z.coerce.number().min(0).optional(),
  maxTuition: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

// GET /api/schools/search - Search for schools (public endpoint)
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = searchQuerySchema.safeParse(req.query)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: validation.error.errors,
      })
    }

    const { query, state, type, minTuition, maxTuition, page, limit } = validation.data

    let results = schoolsData.filter(s => s.isActive)

    // Apply filters
    if (query) {
      const searchTerm = query.toLowerCase()
      results = results.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.city.toLowerCase().includes(searchTerm) ||
        s.id.includes(searchTerm)
      )
    }

    if (state) {
      results = results.filter(s => s.state.toUpperCase() === state.toUpperCase())
    }

    if (type) {
      results = results.filter(s => s.type === type)
    }

    if (minTuition !== undefined) {
      results = results.filter(s => s.inStateTuition >= minTuition)
    }

    if (maxTuition !== undefined) {
      results = results.filter(s => s.inStateTuition <= maxTuition)
    }

    // Sort by name
    results.sort((a, b) => a.name.localeCompare(b.name))

    // Pagination
    const total = results.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = results.slice(startIndex, endIndex)

    logger.info(`School search: query="${query || ''}", results=${total}`)

    res.json({
      schools: paginatedResults.map(s => ({
        id: s.id,
        name: s.name,
        city: s.city,
        state: s.state,
        type: s.type,
        inStateTuition: s.inStateTuition,
        outStateTuition: s.outStateTuition,
        averageAid: s.averageAid,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: endIndex < total,
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/schools/:id - Get school details
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const school = schoolsData.find(s => s.id === id)

    if (!school) {
      return res.status(404).json({
        error: 'Not Found',
        message: `School with code ${id} not found`,
      })
    }

    logger.info(`School details retrieved: ${id} - ${school.name}`)

    res.json({
      school: {
        id: school.id,
        name: school.name,
        city: school.city,
        state: school.state,
        zip: school.zip,
        type: school.type,
        website: school.website,
        phone: school.phone,
        costs: {
          inStateTuition: school.inStateTuition,
          outStateTuition: school.outStateTuition,
          roomAndBoard: school.roomAndBoard,
          totalInState: school.inStateTuition + school.roomAndBoard,
          totalOutState: school.outStateTuition + school.roomAndBoard,
        },
        aid: {
          averageAid: school.averageAid,
          netPriceInState: school.inStateTuition + school.roomAndBoard - school.averageAid,
          netPriceOutState: school.outStateTuition + school.roomAndBoard - school.averageAid,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/schools/states - Get list of states with school counts
router.get('/meta/states', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stateCounts = schoolsData.reduce((acc, school) => {
      acc[school.state] = (acc[school.state] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const states = Object.entries(stateCounts)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => a.state.localeCompare(b.state))

    res.json({
      states,
      totalSchools: schoolsData.length,
    })
  } catch (error) {
    next(error)
  }
})

export default router
