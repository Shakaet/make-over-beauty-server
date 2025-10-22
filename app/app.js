import cors from 'cors'
import express from 'express'
import { notFound } from './middleware/notfound.js'
import { globarError } from './middleware/globalError.js'

const app = express()


app.use(express.json())
app.use(cors())



app.get('/', (req, res) => {

  // Promise.reject()
  res.send('Hello World!')
})


// // catch all error
app.use(notFound)

// /// global error handler

app.use(globarError)


export default app
