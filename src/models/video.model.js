import mongoose, {Schema} from "mongoose";
//import the aggregation 
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

/************* CREATE THE VIDEO MODEL,WHAT AND HOW TO STORE ********/
const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, //ai duration ta actually provide korbo URL da oi, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)

/************* VIDEO MODEL CREATED ***********/


/************* ADD PLUGIN**********/
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)