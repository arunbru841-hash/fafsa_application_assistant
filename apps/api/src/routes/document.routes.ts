import { Router, Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'
import { config } from '../config'

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`)
  },
})

const fileFilter = (_req: AuthRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize,
  },
})

// In-memory document storage (replace with database in production)
const documents: Map<string, Document> = new Map()

// Types
interface Document {
  id: string
  userId: string
  applicationId?: string
  type: DocumentType
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  storageKey: string
  status: 'pending' | 'processing' | 'verified' | 'rejected'
  ocrData?: Record<string, unknown>
  verificationStatus?: 'pending' | 'verified' | 'needs-review' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

type DocumentType = 
  | 'tax-return'
  | 'w2'
  | 'bank-statement'
  | 'pay-stub'
  | 'identity'
  | 'residency'
  | 'other'

// Validation schemas
const uploadMetadataSchema = z.object({
  applicationId: z.string().uuid().optional(),
  type: z.enum(['tax-return', 'w2', 'bank-statement', 'pay-stub', 'identity', 'residency', 'other']),
})

// All routes require authentication
router.use(authenticate)

// POST /api/documents/upload - Upload a document
router.post('/upload', upload.single('file'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!req.file) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'No file uploaded' 
      })
    }

    const metadataValidation = uploadMetadataSchema.safeParse(req.body)
    if (!metadataValidation.success) {
      return res.status(400).json({
        error: 'Invalid metadata',
        details: metadataValidation.error.errors,
      })
    }

    const { applicationId, type } = metadataValidation.data

    const document: Document = {
      id: uuidv4(),
      userId,
      applicationId,
      type,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      storageKey: req.file.path,
      status: 'pending',
      verificationStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    documents.set(document.id, document)

    logger.info(`User ${userId} uploaded document ${document.id}: ${document.originalName}`)

    // In production, trigger OCR processing here
    // await queueOCRProcessing(document.id)

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        type: document.type,
        fileName: document.originalName,
        fileSize: document.fileSize,
        status: document.status,
        createdAt: document.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/documents - List all documents for the user
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { applicationId } = req.query

    let userDocuments = Array.from(documents.values())
      .filter(doc => doc.userId === userId)

    if (applicationId && typeof applicationId === 'string') {
      userDocuments = userDocuments.filter(doc => doc.applicationId === applicationId)
    }

    userDocuments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    logger.info(`User ${userId} retrieved ${userDocuments.length} documents`)

    res.json({
      documents: userDocuments.map(doc => ({
        id: doc.id,
        type: doc.type,
        fileName: doc.originalName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        status: doc.status,
        verificationStatus: doc.verificationStatus,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      total: userDocuments.length,
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/documents/:id - Get document details
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const document = documents.get(id)

    if (!document) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Document not found',
      })
    }

    if (document.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this document',
      })
    }

    logger.info(`User ${userId} retrieved document ${id}`)

    res.json({
      document: {
        id: document.id,
        type: document.type,
        fileName: document.originalName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        status: document.status,
        verificationStatus: document.verificationStatus,
        ocrData: document.ocrData,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const document = documents.get(id)

    if (!document) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Document not found',
      })
    }

    if (document.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this document',
      })
    }

    // In production, also delete the file from storage
    // await fs.unlink(document.storageKey)

    documents.delete(id)

    logger.info(`User ${userId} deleted document ${id}`)

    res.json({
      message: 'Document deleted successfully',
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/documents/:id/verify - Manually verify a document (admin only)
router.post('/:id/verify', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const { id } = req.params
    const { status, notes } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // In production, check for admin role
    // if (req.user?.role !== 'admin') {
    //   return res.status(403).json({ error: 'Forbidden' })
    // }

    const document = documents.get(id)

    if (!document) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Document not found',
      })
    }

    document.verificationStatus = status
    document.status = status === 'verified' ? 'verified' : status === 'rejected' ? 'rejected' : 'processing'
    document.updatedAt = new Date()
    
    if (notes) {
      document.ocrData = { ...document.ocrData, verificationNotes: notes }
    }

    documents.set(id, document)

    logger.info(`Document ${id} verification updated to ${status} by ${userId}`)

    res.json({
      message: 'Document verification updated',
      document: {
        id: document.id,
        status: document.status,
        verificationStatus: document.verificationStatus,
        updatedAt: document.updatedAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
