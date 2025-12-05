import express from "express";
import User from "./user.model.js";
import { catchAsynFunction } from "../../utils/catchasync.js";
import { auth } from "../../middleware/auth.js";


const router = express.Router();

// POST new user
router.post("/", catchAsynFunction(async (req, res) => {
  try {
    const userData = req.body;
    console.log(userData)
    const existing = await User.findOne({ email: userData.email});

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // use the underlying MongoDB collection directly
    const result = await User.create(userData);

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}))


// Get new user
router.get("/", auth("customer"), catchAsynFunction(async (req, res) => {
  
   

    // use the underlying MongoDB collection directly
    const result = await User.find();

    res.status(201).json({ 
        data:result
     });
  } 
))



  router.get("/getCustomer/:email", async (req, res) => {

            let email = req.params.email

            // console.log(email)

            let query = { email: email }
            let result = await User.findOne(query)

            // console.log(result)

                if (!result) {
                   return res.send({ message: "No customer found" })
                   }
                        let customer = false
                        if (result.role === "customer") {
                            customer = true
                        }

                        res.send({ customer })



      })


      router.get("/getadmin/:email", async (req, res) => {

            let email = req.params.email

            // console.log(email)

            let query = { email: email }
            let result = await User.findOne(query)

            // console.log(result)

                if (!result) {
                   return res.send({ message: "No admin found" })
                   }
                        let admin = false
                        if (result.role === "admin") {
                            admin = true
                        }

                        res.send({ admin })

      })



      router.get("/getmanager/:email", async (req, res) => {

            let email = req.params.email

            // console.log(email)

            let query = { email: email }
            let result = await User.findOne(query)

            // console.log(result)

                if (!result) {
                   return res.send({ message: "No shop manager found" })
                   }
                        let manager = false
                        if (result.role === "manager") {
                            manager = true
                        }

                        res.send({ manager })



      })

        





   router.get('/allmanager', async (req, res) => {
       try {
         const result = await User.find({ role: "manager" })
           res.send(result);
        } catch (err) {
                res.status(500).send({ message: 'Failed to fetch manager' });
        }
    });



    // PATCH: Update manager access
    router.patch("/update-manager-access/:id", async (req, res) => {
          try {
              const managerId = req.params.id;
              const {
                  product_access,
                  blog_access,
                  order_access,
                  siteSetting_access,
                  customer_access,
                  role
              } = req.body;


              let user=await User.findById(managerId)

              let isManager=user?.role

              if(isManager !== "manager"){
                throw new Error("You are not Shop Manager")
              }

              const updatedUser = await User.findByIdAndUpdate(
                  managerId,
                  {
                      product_access,
                      blog_access,
                      order_access,
                      siteSetting_access,
                      customer_access
                  },
                  { new: true }
              );

              if (!updatedUser) {
                  return res.status(404).json({
                      status: false,
                      message: "User not found"
                  });
              }

              res.status(200).json({
                  status: true,
                  message: "Access updated successfully",
                  data: updatedUser
              });
          } catch (error) {
              res.status(500).json({
                  status: false,
                  message: "Something went wrong",
                  error: error.message
              });
          }
});


        // true field return
        router.get("/manager/access/:email", async (req, res) => {
            try {
                const { email } = req.params;

                if (!email) {
                    return res.status(400).json({ message: "Email is required" });
                }

                

                const user = await User.findOne(
                    { email },
                    
                       "role product_access blog_access order_access siteSetting_access customer_access"
                    
                );

                console.log(user)

                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                // 🚫 Not an ambassador → Access Denied
                if (user.role !== "manager") {
                    return res.status(403).json({
                        message: "Access denied: Not an manager"
                    });
                }

                // ✅ Only return TRUE access fields
                const trueFields = {};
                if (user.product_access) trueFields.product_access = true;
                if (user.blog_access) trueFields.blog_access = true;
                if (user.order_access) trueFields.order_access = true;
                if (user.siteSetting_access) trueFields.siteSetting_access = true;
                if (user.customer_access) trueFields.customer_access = true;

                return res.status(200).json({
                    role: user.role,
                    access: trueFields
                });

            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        });



 export let userRoutes=router

