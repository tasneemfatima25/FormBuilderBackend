const Submission = require('../models/Submission')
const Form = require('../models/Form')
const mongoose = require('mongoose')

const multer = require('multer')

// Multer config
const upload = multer()

exports.submitForm = [
  upload.any(), // accepts all fields including files
  async (req, res) => {
    const { id } = req.params

    try {
      // ✅ 1. Validate ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid form ID' })
      }

      // ✅ 2. Get form
      const form = await Form.findById(id)
      if (!form) {
        return res.status(404).json({ error: 'Form not found' })
      }

     // ✅ 3. Check submission limit
const submissionCount = await Submission.countDocuments({ formId: id })
if (form.submissionLimit && submissionCount >= form.submissionLimit) {
  return res.status(400).json({ error: 'Submission limit reached' })
}


      // ✅ 4. Parse all values
      const parsedValues = {}

      // 4.a Form fields from req.body
      for (const key in req.body) {
        try {
          parsedValues[key] = JSON.parse(req.body[key])
        } catch {
          parsedValues[key] = req.body[key]
        }
      }

      // 4.b Files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          // Convert buffer to base64 string (or you can save to disk / S3)
          parsedValues[file.fieldname] = {
            filename: file.originalname,
            mimetype: file.mimetype,
            data: file.buffer.toString('base64') // base64
          }
        })
      }

      // ✅ 5. Save submission
      const submission = await Submission.create({
        formId: id,
        values: parsedValues
      })

      return res.status(201).json(submission)
    } catch (err) {
      console.error('❌ Submission failed:', err)
      return res.status(500).json({ error: 'Failed to save submission' })
    }
  }
]

exports.getFormSubmissions = async (req, res) => {
    const { id } = req.params
  
    try {
      // 1. Validate form ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid form ID' })
      }
  
      // 2. Fetch all submissions for this form
      const submissions = await Submission.find({ formId: id }).sort({ createdAt: -1 })
  
      res.status(200).json(submissions)
    } catch (err) {
      console.error('❌ Failed to get submissions:', err)
      res.status(500).json({ error: 'Failed to fetch submissions' })
    }
  }
  
  

  exports.getAnalytics = async (req, res) => {
    const { id } = req.params
  
    try {
      const submissions = await Submission.find({
        formId: new mongoose.Types.ObjectId(id)
      })
      res.status(200).json(submissions)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch analytics' })
    }
  }


  exports.getAllAnalytics = async (req, res) => {
    try {
      const data = await Submission.aggregate([
        {
          $group: {
            _id: '$formId',
            totalSubmissions: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'forms',
            localField: '_id',
            foreignField: '_id',
            as: 'form'
          }
        },
        { $unwind: '$form' },
        {
          $project: {
            formId: '$_id',
            title: '$form.title',
            totalSubmissions: 1,
            _id: 0
          }
        }
      ])
  
      res.json(data)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch analytics' })
    }
  }
  