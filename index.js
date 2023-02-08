const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI
const mongoose = require('mongoose')
const fs = require('fs')

mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to MongoDB')
  }
)
const photoSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
})

const Photo = mongoose.model('Photo', photoSchema)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('photo'), (req, res) => {
  const photo = fs.readFileSync(req.file.path)
  const encodedImage = photo.toString('base64')
  const newPhoto = new Photo({
    name: req.file.originalname,
    data: Buffer.from(encodedImage, 'base64'),
  })
  newPhoto.save((err, result) => {
    console.log('Photo added to the database')
    fs.unlinkSync(req.file.path)
    res.send('File uploaded')
  })
})

app.get('/photos', (req, res) => {
  res.send('Hello World!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log('Server started on port 3000')
})
