const router = require('express').Router()
const {
  createForm, getAllForms, getFormById, updateForm, deleteForm, updateFormStatus
} = require('../controllers/forms.controller')

router.post('/', createForm)
router.get('/', getAllForms)
router.get('/:id', getFormById)
router.put('/:id', updateForm)
router.delete('/:id', deleteForm)
router.patch('/:id/status', updateFormStatus)

module.exports = router
