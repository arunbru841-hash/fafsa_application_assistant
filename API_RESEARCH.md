# Free APIs for FAFSA Assistant Application

This document provides comprehensive research on free APIs that can be integrated into the FAFSA Assistant web application to enhance functionality with real-time data.

## Table of Contents

1. [College Scorecard API](#1-college-scorecard-api)
2. [Fiscal Data Treasury API](#2-fiscal-data-treasury-api)
3. [FRED API (Federal Reserve Economic Data)](#3-fred-api-federal-reserve-economic-data)
4. [IPEDS Data (Integrated Postsecondary Education Data System)](#4-ipeds-data)
5. [Data.gov Education Datasets](#5-datagov-education-datasets)
6. [NCES Data Resources](#6-nces-data-resources)
7. [Implementation Recommendations](#7-implementation-recommendations)

---

## 1. College Scorecard API

**⭐ HIGHLY RECOMMENDED - Primary API for School Data**

### Overview
The College Scorecard API provides comprehensive data about U.S. colleges and universities, including costs, graduation rates, student outcomes, and financial aid information. This is the most relevant API for a FAFSA assistant application.

### Access Information
| Property | Value |
|----------|-------|
| **Base URL** | `https://api.data.gov/ed/collegescorecard/v1/` |
| **Authentication** | Free API key required |
| **API Key Signup** | https://api.data.gov/signup/ |
| **Rate Limits** | 1,000 requests/hour (standard tier) |
| **Cost** | **FREE** |
| **Documentation** | https://github.com/RTICWDT/open-data-maker/blob/master/API.md |

### Key Endpoints

#### Schools Endpoint
```
GET /schools.json
```

### Available Data Fields

#### School Information
- `id` - Unique school identifier
- `school.name` - School name (autocomplete searchable)
- `school.city` - City location
- `school.state` - State code (e.g., "NY", "CA")
- `school.zip` - ZIP code
- `school.school_url` - School website
- `school.region_id` - Geographic region
- `school.degrees_awarded.predominant` - Primary degree type (1=Certificate, 2=Associate, 3=Bachelor's, 4=Graduate)
- `school.ownership` - 1=Public, 2=Private nonprofit, 3=Private for-profit

#### Cost Data
- `latest.cost.tuition.in_state` - In-state tuition
- `latest.cost.tuition.out_of_state` - Out-of-state tuition
- `latest.cost.avg_net_price.overall` - Average net price after aid
- `latest.cost.avg_net_price.public` - Average net price (public schools)
- `latest.cost.avg_net_price.private` - Average net price (private schools)

#### Financial Aid Data
- `latest.aid.pell_grant_rate` - Percentage receiving Pell Grants
- `latest.aid.federal_loan_rate` - Percentage receiving federal loans
- `latest.aid.median_debt.completers.overall` - Median debt at graduation
- `latest.aid.median_debt.completers.monthly_payments` - Median monthly loan payment

#### Student Information
- `latest.student.size` - Total enrollment
- `latest.student.enrollment.undergrad_12_month` - Undergraduate enrollment
- `latest.admissions.admission_rate.overall` - Admission rate

#### Outcomes Data
- `latest.completion.rate_suppressed.overall` - Graduation rate
- `latest.earnings.10_yrs_after_entry.median` - Median earnings 10 years after entry

### Query Examples

#### Search by School Name
```
https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=YOUR_KEY&school.name=Harvard&_fields=id,school.name,school.city,school.state,latest.cost.tuition.in_state
```

#### Filter by State and Degree Type
```
https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=YOUR_KEY&school.state=NY&school.degrees_awarded.predominant=3&_fields=id,school.name,latest.cost.tuition.in_state,latest.aid.pell_grant_rate
```

#### Geographic Search (within 50 miles of ZIP code)
```
https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=YOUR_KEY&zip=10001&distance=50mi&_fields=id,school.name,school.city,location.lat,location.lon
```

#### Pagination
```
https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=YOUR_KEY&_page=2&_per_page=50
```

### Query Operators
- **Range**: `latest.student.size__range=1000..5000`
- **Not Equal**: `school.region_id__not=5`
- **Multiple Values**: `school.degrees_awarded.predominant=2,3,4`

### Response Format
```json
{
  "metadata": {
    "total": 3667,
    "page": 0,
    "per_page": 20
  },
  "results": [
    {
      "id": 190752,
      "school.name": "Example University",
      "latest.cost.tuition.in_state": 15000,
      "latest.student.size": 5000
    }
  ]
}
```

### Use Cases for FAFSA Assistant
1. **School Search/Autocomplete** - Help users find and select schools
2. **Cost Estimation** - Display tuition and net price data
3. **Financial Aid Preview** - Show Pell Grant and loan rates
4. **School Comparison** - Compare costs across multiple schools
5. **Aid Estimator** - Use average aid data for estimates

---

## 2. Fiscal Data Treasury API

**RECOMMENDED for Interest Rate Data**

### Overview
The U.S. Treasury's Fiscal Data API provides federal financial data including interest rates on Treasury securities. This can be useful for displaying current federal student loan interest rates context.

### Access Information
| Property | Value |
|----------|-------|
| **Base URL** | `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/` |
| **Authentication** | **No API key required** |
| **Rate Limits** | None specified |
| **Cost** | **FREE** |
| **Documentation** | https://fiscaldata.treasury.gov/api-documentation/ |

### Key Endpoints

#### Average Interest Rates on Treasury Securities
```
GET /v2/accounting/od/avg_interest_rates
```

#### Debt to the Penny (National Debt)
```
GET /v2/accounting/od/debt_to_penny
```

### Query Parameters
| Parameter | Description | Example |
|-----------|-------------|---------|
| `fields` | Comma-separated list of fields | `fields=record_date,avg_interest_rate_amt` |
| `filter` | Filter records | `filter=record_date:gte:2024-01-01` |
| `sort` | Sort order | `sort=-record_date` |
| `page[size]` | Records per page | `page[size]=10` |
| `page[number]` | Page number | `page[number]=1` |
| `format` | Output format | `format=json` (default) |

### Filter Operators
- `eq` - Equal to
- `lt` - Less than
- `lte` - Less than or equal to
- `gt` - Greater than
- `gte` - Greater than or equal to
- `in` - In a list

### Example Query
```
https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?fields=record_date,security_type_desc,avg_interest_rate_amt&filter=record_date:gte:2024-01-01&sort=-record_date&page[size]=10
```

### Response Format
```json
{
  "data": [
    {
      "record_date": "2024-01-31",
      "security_type_desc": "Treasury Notes",
      "avg_interest_rate_amt": "2.5"
    }
  ],
  "meta": {
    "count": 10,
    "total-count": 100,
    "total-pages": 10
  },
  "links": {
    "self": "...",
    "first": "...",
    "next": "..."
  }
}
```

### Use Cases for FAFSA Assistant
1. **Interest Rate Context** - Display Treasury rates alongside student loan rates
2. **Economic Indicators** - Show national debt trends for financial literacy content
3. **Historical Comparison** - Compare current rates to historical averages

---

## 3. FRED API (Federal Reserve Economic Data)

**RECOMMENDED for Economic Data**

### Overview
The Federal Reserve Bank of St. Louis provides FRED, a comprehensive database of economic data. Useful for inflation data, cost of living indices, and economic indicators.

### Access Information
| Property | Value |
|----------|-------|
| **Base URL** | `https://api.stlouisfed.org/fred/` |
| **Authentication** | Free API key required |
| **API Key Signup** | https://fred.stlouisfed.org/docs/api/api_key.html |
| **Rate Limits** | 120 requests per minute |
| **Cost** | **FREE** |
| **Documentation** | https://fred.stlouisfed.org/docs/api/fred/ |

### Key Endpoints

#### Get Series Observations (Data Points)
```
GET /series/observations?series_id=SERIES_ID&api_key=YOUR_KEY&file_type=json
```

#### Search for Series
```
GET /series/search?search_text=QUERY&api_key=YOUR_KEY&file_type=json
```

### Relevant Series IDs

| Series ID | Description | Use Case |
|-----------|-------------|----------|
| `CPIAUCSL` | Consumer Price Index (CPI) | Inflation adjustments |
| `FEDFUNDS` | Federal Funds Rate | Interest rate context |
| `UNRATE` | Unemployment Rate | Economic context |
| `MEHOINUSA672N` | Median Household Income | Aid calculations |
| `TOTALSL` | Total Student Loans Outstanding | Student debt statistics |

### Example Query
```
https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=YOUR_KEY&file_type=json&observation_start=2024-01-01
```

### Response Format
```json
{
  "realtime_start": "2024-01-01",
  "realtime_end": "2024-12-31",
  "observation_start": "2024-01-01",
  "observation_end": "2024-12-31",
  "units": "lin",
  "output_type": 1,
  "file_type": "json",
  "order_by": "observation_date",
  "sort_order": "asc",
  "count": 12,
  "offset": 0,
  "limit": 100000,
  "observations": [
    {
      "realtime_start": "2024-01-01",
      "realtime_end": "2024-12-31",
      "date": "2024-01-01",
      "value": "308.417"
    }
  ]
}
```

### Use Cases for FAFSA Assistant
1. **Poverty Guidelines Context** - Use CPI for inflation adjustments
2. **Economic Indicators** - Display relevant economic data
3. **Student Debt Statistics** - Show total student loan outstanding
4. **Cost of Living** - Regional cost comparisons

---

## 4. IPEDS Data

**USEFUL for Detailed Institution Data**

### Overview
The Integrated Postsecondary Education Data System (IPEDS) from NCES provides detailed data about U.S. colleges and universities. While not a REST API, data can be accessed through downloadable files.

### Access Information
| Property | Value |
|----------|-------|
| **Data Portal** | https://nces.ed.gov/ipeds/use-the-data |
| **Authentication** | None required |
| **Cost** | **FREE** |
| **Format** | CSV, Access Database |

### Available Data Categories
- Institutional Characteristics
- Enrollment (Fall, 12-month)
- Completions (Degrees awarded)
- Graduation Rates
- Student Financial Aid
- Tuition and Fees
- Employees and Salaries
- Finance

### Access Methods

#### 1. Complete Data Files
Download full datasets: https://nces.ed.gov/ipeds/datacenter/Default.aspx?gotoReportId=7

#### 2. Custom Data Files
Create custom queries: https://nces.ed.gov/ipeds/datacenter/Default.aspx?gotoReportId=5

#### 3. Access Database
Annual compiled database: https://nces.ed.gov/ipeds/use-the-data/download-access-database

### Use Cases for FAFSA Assistant
1. **Supplemental School Data** - Detailed institutional information
2. **Historical Trends** - Multi-year data analysis
3. **Research Features** - Advanced data exploration

---

## 5. Data.gov Education Datasets

**REFERENCE for Additional Data Sources**

### Overview
Data.gov hosts 600+ education-related datasets from federal, state, and local governments.

### Access Information
| Property | Value |
|----------|-------|
| **Catalog URL** | https://catalog.data.gov/dataset?tags=education |
| **API** | CKAN API |
| **Documentation** | https://docs.ckan.org/en/2.11/api/index.html |
| **Cost** | **FREE** |

### Key Datasets

#### Postsecondary School Locations
- Over 7,000 institutions with geographic data
- Includes: Name, address, coordinates, sector
- Format: GeoJSON, CSV, Shapefile
- URL: https://data-nces.opendata.arcgis.com/

#### Public School Locations
- K-12 school data
- Geographic coordinates
- Format: Multiple

#### Assistance Listings (CFDA Programs)
- Federal assistance programs
- Includes education grants and loans
- URL: https://sam.gov/

### CKAN API Example
```
https://catalog.data.gov/api/3/action/package_search?q=education+financial+aid
```

---

## 6. NCES Data Resources

**REFERENCE for Education Statistics**

### Overview
The National Center for Education Statistics provides various data tools and APIs for education data.

### Available Tools

#### 1. DataLab
Interactive data analysis tool
URL: https://nces.ed.gov/datalab/

#### 2. EDGE Geocoding API
School location data with REST API
Base URL: `https://nces.ed.gov/opengis/rest/services/`

#### 3. School Locations GeoService
```
https://nces.ed.gov/opengis/rest/services/Postsecondary_School_Locations/EDGE_GEOCODE_POSTSECONDARYSCH_2223/MapServer/0
```

---

## 7. Implementation Recommendations

### Priority Integration Order

#### Phase 1: Essential (Week 1-2)
1. **College Scorecard API** - Core school search and cost data
   - Implement school search autocomplete
   - Display tuition and cost information
   - Show financial aid statistics

#### Phase 2: Enhanced (Week 3-4)
2. **Fiscal Data Treasury API** - Interest rate data
   - Display current Treasury rates
   - Provide rate comparison context

3. **FRED API** - Economic context
   - Inflation data for calculations
   - Economic indicators

#### Phase 3: Advanced (Future)
4. **IPEDS Data** - Detailed analytics
   - Historical trend analysis
   - Advanced school comparisons

### API Integration Architecture

```
apps/api/src/
├── services/
│   ├── collegescorecard.service.ts  # College Scorecard API wrapper
│   ├── treasury.service.ts          # Fiscal Data API wrapper
│   └── fred.service.ts              # FRED API wrapper
├── routes/
│   ├── schools.routes.ts            # School search endpoints
│   ├── costs.routes.ts              # Cost/tuition endpoints
│   └── rates.routes.ts              # Interest rate endpoints
└── config/
    └── api-keys.ts                  # API key management
```

### Environment Variables
```env
# College Scorecard API
COLLEGE_SCORECARD_API_KEY=your_api_key_here

# FRED API
FRED_API_KEY=your_api_key_here

# Note: Fiscal Data Treasury API does not require an API key
```

### Caching Strategy
- **School data**: Cache for 24 hours (data updates infrequently)
- **Interest rates**: Cache for 1 hour
- **Economic data**: Cache for 6 hours

### Error Handling
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  cached?: boolean;
  cacheExpiry?: Date;
}
```

### Rate Limiting Considerations
| API | Rate Limit | Strategy |
|-----|------------|----------|
| College Scorecard | 1,000/hour | Implement client-side caching, batch requests |
| Fiscal Data | None | No special handling needed |
| FRED | 120/minute | Queue requests, implement backoff |

---

## Quick Start Code Examples

### College Scorecard API (TypeScript)
```typescript
// apps/api/src/services/collegescorecard.service.ts
import axios from 'axios';

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1';
const API_KEY = process.env.COLLEGE_SCORECARD_API_KEY;

interface School {
  id: number;
  'school.name': string;
  'school.city': string;
  'school.state': string;
  'latest.cost.tuition.in_state': number;
  'latest.cost.tuition.out_of_state': number;
  'latest.student.size': number;
}

export async function searchSchools(query: string, state?: string) {
  const params = new URLSearchParams({
    api_key: API_KEY!,
    'school.name': query,
    _fields: 'id,school.name,school.city,school.state,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.student.size',
    _per_page: '20'
  });

  if (state) {
    params.append('school.state', state);
  }

  const response = await axios.get(`${BASE_URL}/schools.json?${params}`);
  return response.data.results as School[];
}

export async function getSchoolById(id: number) {
  const params = new URLSearchParams({
    api_key: API_KEY!,
    id: id.toString(),
    _fields: 'id,school.name,school.city,school.state,school.school_url,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.cost.avg_net_price.overall,latest.aid.pell_grant_rate,latest.aid.federal_loan_rate,latest.aid.median_debt.completers.overall,latest.student.size,latest.admissions.admission_rate.overall,latest.completion.rate_suppressed.overall'
  });

  const response = await axios.get(`${BASE_URL}/schools.json?${params}`);
  return response.data.results[0];
}
```

### Fiscal Data API (TypeScript)
```typescript
// apps/api/src/services/treasury.service.ts
import axios from 'axios';

const BASE_URL = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service';

export async function getInterestRates() {
  const params = new URLSearchParams({
    fields: 'record_date,security_type_desc,avg_interest_rate_amt',
    'sort': '-record_date',
    'page[size]': '10'
  });

  const response = await axios.get(
    `${BASE_URL}/v2/accounting/od/avg_interest_rates?${params}`
  );
  return response.data.data;
}
```

---

## Summary Table

| API | Best For | Auth | Cost | Rate Limit |
|-----|----------|------|------|------------|
| **College Scorecard** | School search, costs, aid data | API Key | Free | 1,000/hr |
| **Fiscal Data Treasury** | Interest rates, debt data | None | Free | None |
| **FRED** | Economic indicators, CPI | API Key | Free | 120/min |
| **IPEDS** | Detailed institution data | None | Free | N/A (downloads) |
| **Data.gov** | Various education datasets | Varies | Free | Varies |

---

## Next Steps

1. **Sign up for API keys**:
   - https://api.data.gov/signup/ (College Scorecard)
   - https://fred.stlouisfed.org/docs/api/api_key.html (FRED)

2. **Create API service modules** in `apps/api/src/services/`

3. **Implement caching layer** with Redis or in-memory cache

4. **Add school search feature** to the web application

5. **Enhance aid estimator** with real school cost data

---

*Last Updated: January 2025*
