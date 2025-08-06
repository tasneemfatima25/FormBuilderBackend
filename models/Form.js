const mongoose = require('mongoose')

const FieldSchema = new mongoose.Schema({
  type: String,
  label: String,
  name: String,
  required: Boolean,
  placeholder: String,
  options: [String]
},)

const FormSchema = new mongoose.Schema({
  title: String,
  description: String,
  fields: [FieldSchema],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  submissionLimit: Number,
  thankYouMessage: String
}, { timestamps: true })

module.exports = mongoose.model('Form', FormSchema)
