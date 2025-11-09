import mongoose, { Schema } from 'mongoose'

const likeSchema = new Schema(
  {
    recipe: { type: Schema.Types.ObjectId, ref: 'recipe', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true },
)

// Unique index to prevent duplicate likes by the same user on the same recipe
likeSchema.index({ recipe: 1, user: 1 }, { unique: true })

export const Like = mongoose.model('likes', likeSchema)
