


import { Router } from "express"
import { upload } from "../../utils/sendImagestoCloudinary.js"
import { AllSiteSetting, updateSiteSetting } from "./siteSetting.controller.js"







 let router= Router()


 router.patch("/",

     upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  (req,res,next)=>{

    req.body= JSON.parse(req.body.data)
    // console.log(req.body)
    next()

  },
  updateSiteSetting


 )


 router.get("/",

    
  AllSiteSetting


 )


 

 


 







 export let siteSettingRoute=router