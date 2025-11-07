import cors from 'cors'
import express from 'express'
import { notFound } from './middleware/notfound.js'
import { globarError } from './middleware/globalError.js'
import { userRoutes } from './modules/user/user.route.js'
import router from './routes/index.js'


const app = express()


app.use(express.json())
app.use(cors({
  origin:["http://localhost:3000","https://makeover-beauty.netlify.app"]
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
