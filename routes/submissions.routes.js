const router = require('express').Router()
const {
  submitForm, getAnalytics, getAllAnalytics, getFormSubmissions
} = require('../controllers/submissions.controller')

router.post('/:id/submissions', submitForm)
router.get('/:id/submissions', getFormSubmissions)

router.get('/analytics/:id', getAnalytics)
router.get('/analytics', getAllAnalytics)

module.exports = router
