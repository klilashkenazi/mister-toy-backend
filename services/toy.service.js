import fs from 'fs'
import { utilService } from './util.service.js'

const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
    query,
    get,
    remove,
    save
}

function query(filterBy = {}) {
    let toysToReturn = toys
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        toysToReturn = toysToReturn.filter(toy => regExp.test(toy.name))
    }

    if (filterBy.price) {
        toysToReturn = toysToReturn.filter(toy => +toy.price <= filterBy.price)
    }

    if (filterBy.inStock) {
        toysToReturn = toysToReturn.filter(toy => toy.inStock)
    }
    if (filterBy.label) {
        toysToReturn = toysToReturn.filter(toy => toy.labels.includes(filterBy.label))
    }
    return Promise.resolve(toysToReturn)
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('toy not found!')
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')
    toys.splice(idx, 1)
    return _saveToysToFile()

}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
    } else {
        toy._id = _makeId()
        toy.createdAt = Date.now(),
        // toy.labels= ['Doll', 'Battery Powered', 'Baby'],
        toys.push(toy)
    }

    return _saveToysToFile().then(() => toy)
    // return Promise.resolve(toy)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {

        const toysStr = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', toysStr, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}
