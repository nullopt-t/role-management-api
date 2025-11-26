const mongoose = require('mongoose');

const con = mongoose.createConnection(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

con.on('connected', () =>
	console.log('MongoDB connected via createConnection')
);
con.on('error', (err) => console.error('MongoDB connection error:', err));

module.exports = con;
