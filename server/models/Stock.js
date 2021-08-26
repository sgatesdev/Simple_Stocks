const { Schema, model } = require('mongoose');

const StockSchema = new Schema({
    symbol: {
        type: String,
        required: true
    },
    shares: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String
    },
    nickname: {
        type: String
    }
},
{
    timestamps: true
});

const Property = model('Stock', StockSchema);

module.exports = Property;
