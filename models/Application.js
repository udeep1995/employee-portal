const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplicationSchema = new Schema({
      job: {
         type: Schema.Types.ObjectId,
         ref: "job",
         required: true
      },
      users: {
        type: [Schema.Types.ObjectId],
        ref: "users",
        required: true
      }
});

module.exports = Job = mongoose.model("applied", ApplicationSchema);
