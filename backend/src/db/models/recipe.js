import mongoose, { Schema } from 'mongoose'
const recipeSchema = new Schema(
	{
		title: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		ingredients: {
			type: [{ type: String }],
			required: true,
			validate: {
				validator: (arr) => Array.isArray(arr) && arr.length > 0,
				message: 'A recipe must include at least one ingredient',
			},
		},
		imageUrl: { type: String, required: true },
	},
	{ timestamps: true },
)
export const Recipe = mongoose.model('recipe', recipeSchema)