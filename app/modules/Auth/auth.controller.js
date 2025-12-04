import { catchAsynFunction } from "../../utils/catchasync.js"
import { loginUserServices, refreshTokenServices } from "./auth.service.js"

export let  loginUser=catchAsynFunction(async(req,res)=>{



   let result= await loginUserServices(req.body)

     let {accessToken, refreshToken}=result

     // set refresh token in cookie ,firest parameter mane kon name save korbo,2nd ta ki set korbo,3rd ta option

     res.cookie("refreshToken",refreshToken,{
      secure:process.env. NODE_ENV=="production",
      httpOnly:true,

     })
    
     res.status(200).json({
        status: true,
        message: "User Login successfully",
        data: {
            accessToken,
            refreshToken
        }
        });

        
      })




export let  refreshToken=catchAsynFunction(async(req,res)=>{


    let { refreshToken}=req.cookies

    console.log(req.cookies)

    console.log(refreshToken)
   let result= await refreshTokenServices(refreshToken)

    
    
     res.status(200).json({
        status: true,
        message: "Access token is retrived successfully",
        data: result
        });



})
