const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Form',
  },
  values: {
    type: Object,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Submission', submissionSchema)
