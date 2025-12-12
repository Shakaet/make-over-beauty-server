import cors from 'cors'
import express from 'express'
import { notFound } from './middleware/notfound.js'
import { globarError } from './middleware/globalError.js'
import router from './routes/index.js'
import cookieParser from "cookie-parser";


const app = express()
app.use(cookieParser());


app.use(express.json())
app.use(cors({
  origin:["http://localhost:3000","http://localhost:5173","https://makeover-beauty.netlify.app","https://beauty-client.vercel.app", 'http://192.168.0.169:5173']
}))


app.use("/api",router);
app.get('/', (req, res) => {

  // Promise.reject()
  res.send('Hello World!')
})




// // catch all error
app.use(notFound)

// /// global error handler

app.use(globarError)


export default app
