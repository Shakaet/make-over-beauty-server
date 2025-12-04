
import jwt from "jsonwebtoken"
import config from "../config/index.js"
import User from "../modules/user/user.model.js"

export let auth=(...requireRoles)=>{

   return async function(req,res,next){

    let token= req.headers.authorization

    // if the token is sent from the client
    if(!token){
        throw new Error(`You are not Authorized`)
    }

    // check if the token is valid


    // verify a token symmetric


    
// invalid token - synchronous
               
         const decoded = jwt.verify(token, config.JWT_Access_Secret);

            // check roles are valid

            let role= decoded.role

            let email= decoded.email
            


            
             let isUserExist=await User.findOne({email})

                   console.log(isUserExist)
            
                // console.log(user)
                

                if(!isUserExist){
                    throw new Error(`unauthorized access`)
                }


            // console.log(requireRoles,role)

            if(requireRoles && !requireRoles.includes(role)){

                  throw new Error(`You are not Authorized`)

            }

            req.user=decoded
             next()

                

    }

}