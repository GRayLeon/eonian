const mongoose = require('mongoose')
const autoFixMapFields = require('../middleware/autoFixMapFields')

const productSchema = new mongoose.Schema({
  name: {
    type: Map,
    of: String,
    // required: true
  },
  origin: [{
    en: {
      type: String
    },
    zh: {
      type: String
    }
  }],
  appearance: [{
    en: {
      type: String
    },
    zh: {
      type: String
    }
  }],
  functionality: [{
    en: {
      type: String
    },
    zh: {
      type: String
    }
  }],
  support: [{
    en: {
      type: String
    },
    zh: {
      type: String
    }
  }],
  brand: [{
    type: String,
    // required: true
  }],
  model: {
    type: String,
    // required: true
  },
  dimension: {
    type: String,
    // required: true
  },
  slipResistance: {
    type: String,
    // required: true
  },
  application: {
    type: String,
    // required: true
  },
  description: {
    type: Map,
    of: String,
    // required: true
  },
  imageURL: {
    type: String
  },
  imagePublicId: {
    type: String
  },
  subImages: [{
    imageURL: {
      type: String
    },
    imagePublicId: {
      type: String
    },
  }],
  shapes: [{
    title: {
      type: String
    },
    scale: {
      type: Number
    },
    imageURL: {
      type: String
    },
    imagePublicId: {
      type: String
    },
  }],
  colors: [{
    title: {
      type: String
    },
    size: {
      type: String
    },
    imageURL: {
      type: String
    },
    imagePublicId: {
      type: String
    },
  }],
  unitArea: {
    type: Number,
  },
  tags: {
    type: Array,
    of: String
  },
  basePrice: {
    type: Number,
    // required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft',
    // required: true
  }
})

module.exports = mongoose.model('product', productSchema)