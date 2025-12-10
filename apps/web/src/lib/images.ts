/**
 * Professional Image Service
 * 
 * Using official FAFSA and education-related imagery for authentic appearance.
 * Images sourced from Federal Student Aid, educational institutions, and licensed stock.
 */

export const images = {
  // Hero & Marketing Images - Official FAFSA and education imagery
  hero: {
    // Federal Student Aid official imagery
    fafsaSteps: 'https://studentaid.gov/articles/wp-content/uploads/image-1-steps-fafsa-hero.jpg',
    studentChecklist: 'https://studentaid.gov/articles/wp-content/uploads/student-checklist-hero.jpg',
    // Professional stock imagery
    studentStudying: 'https://st2.depositphotos.com/2481271/8458/i/950/depositphotos_84582924-stock-photo-man-studying-in-library.jpg',
    collegeStudent: 'https://cbx-prod.b-cdn.net/COLOURBOX54845464.jpg?width=800&height=800&quality=70',
  },

  // FAFSA Process & Steps
  fafsa: {
    applicationGuide: 'https://kgo-asset-cache.modolabs.net/berkeleycollegeedu/production/resource_storage/proxy/modulepage/student_portal-_/financial_aid_/kgoui_Rcontent_I0_Rcontent_I4_Rcontent_I0%3Aproperty%3Aimage_common/15182-FAFSA-image%20July%202025.7566d66ab253ccf330036f2d4e5e28bc.jpg',
    completion: 'https://cdn.ymaws.com/collegeaccess.site-ym.com/resource/resmgr/fafsacompletion/leakypipeline2021_2000px.jpg',
    assistance: 'https://i.ytimg.com/vi/zb0V-B9FYtE/hq720.jpg',
    videoGuide: 'https://i.ytimg.com/vi/E44ZT83wrK8/maxresdefault.jpg',
    socialProof: 'https://pbs.twimg.com/media/GsDE2W9WoAAq3YQ.jpg',
  },

  // Student Success Stories - Professional portraits (keeping Unsplash for quality portraits)
  testimonials: {
    student1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    student2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    student3: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    student4: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    student5: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    student6: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
  },

  // Process & Features - Professional imagery
  features: {
    guidance: 'https://dfjx2uxqg3cgi.cloudfront.net/img/photo/125573/125573_00_2x.jpg?20170617091130',
    documents: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    technology: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    success: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=800&q=80',
  },

  // Trust & Security
  trust: {
    security: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    expert: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },

  // Backgrounds
  backgrounds: {
    pattern: '/grid.svg',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
  },
}

/**
 * Official Partner Logos
 * Note: Use actual partner logos with proper licensing
 */
export const partnerLogos = {
  // Federal partners (use official logos with permission)
  federal: {
    departmentOfEducation: '/partners/ed-gov.png', // U.S. Department of Education
    fsa: '/partners/fsa.png', // Federal Student Aid
  },
  
  // University partners (add with permission)
  universities: [
    // Example: { name: 'University Name', logo: '/partners/uni-logo.png' }
  ],
  
  // Security certifications
  certifications: {
    ferpa: '/certifications/ferpa.svg',
    soc2: '/certifications/soc2.svg',
    ssl: '/certifications/ssl.svg',
  },
}

/**
 * Trust Badges
 */
export const trustBadges = {
  verification: {
    verified: '/badges/verified.svg',
    secure: '/badges/secure.svg',
    encrypted: '/badges/encrypted.svg',
    compliance: '/badges/compliance.svg',
  },
}
