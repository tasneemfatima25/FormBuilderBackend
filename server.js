const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const multer = require('multer')        // ✅ Import multer
const upload = multer()                 // ✅ Initialize multer


dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

// app.use(upload.any())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

// Routes
app.use('/api/forms', require('./routes/forms.routes'))
app.use('/api/subforms', require('./routes/submissions.routes'))
app.use('/api/setting', require('./routes/setting.routes'))
app.use('/api/upload', require('./routes/upload.routes'))

// app.use('/uploads', express.static('uploads'))

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
})
