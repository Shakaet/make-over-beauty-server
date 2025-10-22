import mongoose from "mongoose"
import config from "./config/index.js"
import app from "./app.js"




let server

async function main() {
  try {
    await mongoose.connect(config.mongo_uri)

   server= app.listen(config.port, () => {
      console.log(`Example app listening on ports ${config.port}`)
    })
  } catch (err) {
    console.log(err)
  }
}

main()



process.on("unhandledRejection",()=>{

  console.log("Unhandled Rejection Shutting down....");

  if(server){
    server.close(()=>{
      
      // console.log("server closed")
      process.exit(1)

    })
  }
  process.exit(1)
  


});

// Promise.reject()

process.on("uncaughtException",()=>{

  console.log("uncaught Exception Shutting down....");

  process.exit(1)


})

// console.log(x)