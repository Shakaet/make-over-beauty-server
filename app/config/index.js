import dotenv from 'dotenv'

import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  port: process.env.PORT,
  mongo_uri: process.env.MONGODB_URI,
  JWT_Access_Secret:process.env.JWT_Access_Secret,
  JWT_Refresh_Secret:process.env.JWT_Refresh_Secret,
  // for cloudinary
  Cloud_Name:process.env.Cloud_Name,
  Api_Key:process.env.Api_Key,
  Api_Secret:process.env.Api_Secret,

}