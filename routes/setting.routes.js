const router = require('express').Router()
const Form = require('../models/Form')

// POST create new form
router.post('/', async (req, res) => {
    try {
      const { title, description, thankYouMessage, submissionLimit, fields, status } = req.body;
  
      const form = new Form({
        title,
        description,
        thankYouMessage,
        submissionLimit,
        fields,
        status: status || 'draft'
      });
  
      const savedForm = await form.save();
      res.status(201).json(savedForm);  // ✅ This line already sends the full saved form including thankYouMessage
    } catch (error) {
      console.error('Error creating form:', error);
      res.status(500).json({ error: 'Something went wrong while creating the form.' });
    }
  });
  
  
// GET form settings
router.get('/:id', async (req, res) => {
    try {
      const form = await Form.findById(req.params.id)
      if (!form) return res.status(404).json({ error: 'Form not found' })
      res.json(form) // ✅ full form including thankYouMessage, description
    } catch (err) {
      console.error('❌ GET error:', err)
      res.status(500).json({ error: 'Server error' })
    }
  })
  
  
  
  
 // PUT update form settings
router.put('/:id', async (req, res) => {
    const updates = (({ title, description, thankYouMessage, submissionLimit }) => ({
      title,
      description,
      thankYouMessage,
      submissionLimit
    }))(req.body)
  
    const form = await Form.findByIdAndUpdate(req.params.id, updates, { new: true })
    res.send(form)
  })
  
  
  
module.exports = router
  