import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'

export const toyRoutes=express.Router()

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:toyId', getToyById)
toyRoutes.post('/', requireAuth, addToy)
toyRoutes.put('/:toyId', requireAuth, requireAdmin, updateToy)
toyRoutes.delete('/:toyId', requireAuth, requireAdmin, removeToy)

toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)