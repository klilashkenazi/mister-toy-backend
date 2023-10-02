import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { addReview , getReviews} from './review.controller.js'

const router = express.Router()

router.get('/', log, requireAuth,getReviews)
router.post('/',  log, requireAuth, addReview)

export const reviewRoutes = router