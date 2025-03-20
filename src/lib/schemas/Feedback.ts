import {Schema} from "mongoose"

const FeedbackSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    answers: {
        type: Array,
        required: true
    }
})

export default FeedbackSchema