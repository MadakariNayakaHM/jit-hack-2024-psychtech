const mongoose = require('mongoose');
const serverDataSchema = mongoose.Schema({
  serverId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Server',
    required: [true, 'Data must belong to a server'],
  },
  data: [
    {
      variableNode: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: false,
            select: false, // Exclude _id from query results
          },
          dataName: String,
          dataSource: [
            {
              _id: {
                type: mongoose.Schema.Types.ObjectId,
                auto: false,
                select: false, // Exclude _id from query results
              },
              dataValue: String,
              timeStamp: String,
            },
          ],
        },
      ],
    },
  ],
}, { versionKey: false });





serverDataSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'serverId',
    select: 'serverEndPoint userId accessId'
  });
  next();
});

const serverData = mongoose.model("serverData", serverDataSchema);

module.exports = serverData;