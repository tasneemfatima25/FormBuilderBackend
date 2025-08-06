const Form = require('../models/Form')

exports.createForm = async (req, res) => {
  try {
    const form = await Form.create(req.body)
    res.status(201).json(form)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllForms = async (req, res) => {
  const forms = await Form.find()
  const withCounts = await Promise.all(forms.map(async form => {
    const count = await require('../models/Submission').countDocuments({ formId: form._id })
    return { ...form.toObject(), submissions: count }
  }))
  res.json(withCounts)
}

exports.getFormById = async (req, res) => {
  const form = await Form.findById(req.params.id)
  await form.save();
  res.status(200).json(form);
  
}

exports.updateForm = async (req, res) => {
  const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(form)
}

exports.deleteForm = async (req, res) => {
  await Form.findByIdAndDelete(req.params.id)
  res.json({ message: 'Form deleted' })
}

exports.updateFormStatus = async (req, res) => {
    try {
      const form = await Form.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      )
      res.json(form)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
  