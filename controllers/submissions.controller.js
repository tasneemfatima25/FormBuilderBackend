const Submission = require('../models/Submission')
const Form = require('../models/Form')
const mongoose = require('mongoose')

const multer = require('multer')

const upload = multer()

exports.submitForm = [
  upload.any(), 
  async (req, res) => {
    const { id } = req.params

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid form ID' })
      }

      const form = await Form.findById(id)
      if (!form) {
        return res.status(404).json({ error: 'Form not found' })
      }

const submissionCount = await Submission.countDocuments({ formId: id })
if (form.submissionLimit && submissionCount >= form.submissionLimit) {
  return res.status(400).json({ error: 'Submission limit reached' })
}


      const parsedValues = {}

      for (const key in req.body) {
        try {
          parsedValues[key] = JSON.parse(req.body[key])
        } catch {
          parsedValues[key] = req.body[key]
        }
      }

      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          parsedValues[file.fieldname] = {
            filename: file.originalname,
            mimetype: file.mimetype,
            data: file.buffer.toString('base64') 
          }
        })
      }

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
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid form ID' })
      }
  
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
  