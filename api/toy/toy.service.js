import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'


export const toyService = {
    query,
    getById,
    remove,
    add,
    update,
    addToyMsg,
    removeToyMsg
}
// async function query(filterBy = { txt: 'o' }) {
//     const criteria = {}
//     if (filterBy.txt) {
//         const regex = new RegExp(filterBy.txt, 'i')
//         criteria.fullName = { $regex: regex }
//     }
//     if (filterBy.minBalance) {
//         criteria.balance = { $gte: filterBy.minBalance }
//     }
//     try {
//         const collection = await dbService.getCollection('customer')
//         const customers = await collection.find(criteria).toArray()
//         return customers
//     } catch (err) {
//         console.log('ERROR: cannot find customers')
//         throw err
//     }
// }

async function query(filterBy = {}) {
    // console.log(filterBy)
    const criteria = {}

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        criteria.name = { $regex: regExp }
    }

    if (filterBy.price) {
        criteria.price = { $lte: filterBy.price }
    }

    if (filterBy.inStock) {
        criteria.inStock = { $eq: filterBy.inStock }
        // toysToReturn = toysToReturn.filter(toy => toy.inStock)
    }
    if (filterBy.label) {
        criteria.labels = { $all: filterBy.label }
        //     toysToReturn = toysToReturn.filter(toy => {
        //         return filterBy.label.every(label => toy.labels.includes(label))
        //     })
    }
    if (filterBy.sortBy) {
        criteria[sortBy] = { $sort: 1 }
        // toysToReturn = toysToReturn.sort((toy1, toy2) => toy1[filterBy.sortBy] - toy2[filterBy.sortBy])
    }
    try {
        const collection = await dbService.getCollection('toy')
        const toys = await collection.find(criteria).toArray()
        return toys
    } catch (err) {
        console.log('ERROR: cannot find customers')
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: ObjectId(toyId) })
        console.log('toy:', toy)
        return toy
    }
    catch {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }

}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}
async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToUpdate = {
            name: toy.name,
            price: toy.price,
            labels: toy.labels,
            inStock: toy.inStock
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToUpdate })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}