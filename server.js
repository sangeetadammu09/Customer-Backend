const express = require('express')
const cors = require('cors')


const app = express()

// middleware
app.use(cors({
    origin: "*"
  }));

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


// routers
const router = require('./src/routes/customerRouter')
app.use('/api', router)

//static Images Folder
app.use('/uploads', express.static('./Images'))


//port
const PORT = process.env.PORT || 8080

//server

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})