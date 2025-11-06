import { Router } from "express"


import { userRoutes } from "../modules/user/user.route.js"
import { productRoutes } from "../modules/product/product.routes.js"

let router = Router()

let AllRoutes = [
  {
    path: '/users',
    routes: userRoutes,
  },
  {
    path: '/products',
    routes: productRoutes,
  },
]

AllRoutes.forEach(route => router.use(route.path, route.routes))


// router.use("/users",userRoutes)

export default router