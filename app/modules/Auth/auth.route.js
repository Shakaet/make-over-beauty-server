import { Router } from "express"
import { loginUser, refreshToken } from "./auth.controller.js"






 let router= Router()


 router.post("/login",
    loginUser
 )


 

  router.post("/refresh-token",
  

     refreshToken
 )


 







 export let authRoute=router