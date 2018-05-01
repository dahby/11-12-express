'use strict';

import mongoose from 'mongoose';

const foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  recipe: {
    type: String,
    required: true,
    minlength: 10,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model('food', foodSchema);
