const express = require('express')
const { LISTEN_PORT } = require('./src/config/env')
const { router } = require('./src/config')
const cors = require('cors');


// initial function
const app = express()

// global middleware --- body parser, rate limit , etc
app.use(express.json())
app.use(cors());

// global router
router(app)

// app.get('/testing',(req,res,next)=>{
//     return res.status(200).json({
//         status : 'success',
//         message : 'Successfully get api test'
//     })
// })
    

// server listen
app.listen(LISTEN_PORT || 7080,()=>{
    console.log(`Server connected to the port : ${LISTEN_PORT}`);
})