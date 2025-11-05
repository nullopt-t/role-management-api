var app = require('./app.js');
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err)=>{
  if(err){
    console.log('Server listening error:', err.message);
    return;
  }
  console.log(`Server is listening on http://localhost:${PORT}`);
})
