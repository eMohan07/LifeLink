const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Emergency Donor Network Analysis',
    },
    summary: {
      type: String,
      required: true,
    },
    metrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    recommendations: {
      type: [String],
      default: [],
    },
    rawResponse: {
      type: String,
      default: '',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AIInsight', aiInsightSchema);
