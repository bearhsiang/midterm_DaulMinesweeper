const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const ResultSchema = new Schema({
	name1: {
		type: String,
		required: [true, 'Name field is required.']
	},
	name2:{
		type: String, 
		required: [false, 'name2 field is requried.']
	},
	result: {
		type: String,
		required: [true, 'result field is required']
	},
	time: {
		type: Number,
		required: [true, 'time field is required.']
	}
})

// Creating a table within database with the defined schema
const Result = mongoose.model('result', ResultSchema)

// Exporting table for querying and mutating
module.exports = Result
