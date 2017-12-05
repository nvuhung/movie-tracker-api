import mongoose from 'mongoose'

const MovieSchema = new mongoose.Schema({
  provider: String,
  url: String,
  title1: String,
  title2: String,
  detail: [{
    _id: false,
    label: String,
    content: String
  }]
});

export default mongoose.model('Movie', MovieSchema)
