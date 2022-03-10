const mongoose = require('mongoose');

// Define the note's database schema
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: String,
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    // Assigns createdAt fields with a Data type
    timestamps: true,
  }
);

// Define the 'note' model with the schema
const Note = mongoose.model('Note', noteSchema);
// Export the module
module.exports = Note;
