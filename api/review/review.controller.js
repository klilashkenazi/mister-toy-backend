import {logger} from '../../services/logger.service.js'
// import {socketService} from '../../services/socket.service.js'
import {authService} from '../auth/auth.service.js'
import {reviewService} from './review.service.js'
import { toyService } from '../toy/toy.service.js'

export async function getReviews(req, res) {
    console.log('req.query',req.query)
    try {
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        logger.error('Cannot get reviews', err)
        res.status(400).send({ err: 'Failed to get reviews' })
    }
}


export async function addReview(req, res) {
    
    var {loggedinUser} = req
 
    try {
        var review = req.body
        console.log(review)
        review.byUserId = loggedinUser._id
        console.log('userId:', review.byUserId)
        review= await reviewService.add(review)
        console.log('review:', review)

        // prepare the updated review for sending out
        // review.aboutToy = await toyService.getById(review.aboutToyId)
        // review.aboutToy = review.aboutToyId

        // Give the user credit for adding a review
        // var user = await userService.getById(review.byUserId)
        // user.score += 10
        // loggedinUser.score += 10

        // loggedinUser = await userService.update(loggedinUser)
        // review.byUser = loggedinUser._id

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        // delete review.aboutToyId
        // delete review.byUserId

        // socketService.broadcast({type: 'review-added', data: review, userId: loggedinUser._id})
        // socketService.emitToUser({type: 'review-about-you', data: review, userId: review.aboutUser._id})
        
        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(review)

    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(400).send({ err: 'Failed to add review' })
    }
}