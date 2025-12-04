import config from "../../config/index.js";
import User from "../user/user.model.js";
import jwt from "jsonwebtoken"

export let loginUserServices=async(payload)=>{


    // // console.log(payload)

    // // check the user is exist

    let email=payload?.email
    // let password=payload?.password
    let isUserExist=await User.findOne({email})

    console.log(isUserExist)

    if(!isUserExist){
        throw new Error(`this User not Exist`)
    }


    // // check the user is already deleted

    // let isUserDeleted=isUserExist?.isDeleted
    // if(isUserDeleted){

    //      throw new AppError(404,`this User not Exist (already Deleted)`,"")

    // }


    // // check if the user is blocked

    // let isUserBlocked=isUserExist?.status

    // if(isUserBlocked==="blocked"){

    //     throw new AppError(404,`this User is Blocked`,"")

    // }



    // // check if the password is correct


    //   // 2️⃣ Password match করো
    // const isMatch = await bcrypt.compare(payload.password, isUserExist.password); // user.password হলো DB তে stored hash

    // if (!isMatch) {
     
    //     throw new AppError(404,`Password did not match`,"")
    // }



    // const user = await validateUserById(id, password);

    console.log(isUserExist)


    // access granted: send Access token,Refresh token


    let jwtPayload={
        email:isUserExist?.email,
        role:isUserExist?.role



    }



    // create json web access token ans sent to the client

   let accessToken= jwt.sign(jwtPayload, config.JWT_Access_Secret  , { expiresIn: "10d" });
     // create json refresh token ans sent to the client

   let refreshToken= jwt.sign(jwtPayload, config.JWT_Refresh_Secret, { expiresIn:"265d"  });

   

   return {
    accessToken,
    refreshToken,
   }



} 



export let refreshTokenServices=async(token)=>{


     // if the token is sent from the client
        if(!token){
            throw new AppError(401,`You are not Authorized`,"")
        }
    
        // check if the token is valid
    
    
        // verify a token symmetric
    
    
        
    // invalid token - synchronous
                   
             const decoded = jwt.verify(token, config.JWT_Refresh_Secret);
    
                // check roles are valid
    
                let role=  decoded.role
    
                let email= decoded.email

                console.log(role,email)
             
    
                   let isUserExist=await User.findOne({email})

                       console.log(isUserExist)
                 
                
                    // console.log(user)
                    
    
                    if(!isUserExist){
                        throw new Error(`unauthorized access`)
                    }
    


    let jwtPayload={
        userId:isUserExist?.email,
        role:isUserExist?.role

    }

     // create json web access token ans sent to the client

   let accessToken= jwt.sign(jwtPayload, config.JWT_Access_Secret , { expiresIn: "10d" });
     // create json refresh token ans sent to the client

   let refreshToken= jwt.sign(jwtPayload, config.JWT_Refresh_Secret , { expiresIn: "265d"  });


    return {
    accessToken
   }

    
    
    
                

}
