import { toyService } from "./toy.service.js"
import { logger } from "../../services/logger.service.js"
export async function getToys(req, res) {
    try {
        const { txt, price, inStock, label, sortBy } = req.query
        // console.log(inStock)
        const filterBy = { txt, price: +price, inStock: JSON.parse(inStock), label, sortBy }
        // console.log(filterBy)
        logger.debug('Getting Toys', filterBy)
        const toys = await toyService.query(filterBy)
        res.json(toys)
    } catch (err) {
        logger.error('Cannot load toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}
// Read - getById
export async function getToyById(req, res) {
    try {
        const { toyId } = req.params
        const toy = await toyService.getById(toyId)
        res.json(toy)

    } catch (err) {
        logger.error('Cannot get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}
// Add
export async function addToy(req, res) {
    const { loggedinUser } = req
    try {
        const { name, price, labels, inStock } = req.body
        // console.log(req.body)
        const toy = {
            name,
            price: +price,
            labels,
            inStock
        }
        // toy.owner = loggedinUser
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
    } catch (err) {
        loggerService.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

// Edit
export async function updateToy(req, res) {
    const { _id, name, price, labels, createdAt, inStock } = req.body
    const toy = {
        _id,
        name,
        labels,
        price: +price,
        createdAt,
        inStock
    }
    try {
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    }
    catch (err) {
        logger.error('Cannot update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

// Remove
export async function removeToy(req, res) {
    try {
        const { toyId } = req.params
        await toyService.remove(toyId)
        res.send()
    } catch (err) {
        loggerService.error('Cannot delete toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    console.log('req.body', req.body)
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const { msgId } = req.params

        const removedId = await toyService.removeToyMsg(toyId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}