import { Router } from "express"


import { userRoutes } from "../modules/user/user.route.js"
import { productRoutes } from "../modules/product/product.routes.js"
import { postRoutes } from "../modules/post/post.route.js"
import { addToCartRoutes } from "../modules/addTocart/addTocart.route.js"
import { chatRoutes } from "../chat/chat.route.js"


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
  {
    path:"/posts",
    routes:postRoutes
  },
  {
    path:"/addTocart",
    routes:addToCartRoutes
  },
  {
    path:"/chat",
    routes:chatRoutes
  }
]

AllRoutes.forEach(route => router.use(route.path, route.routes))


// router.use("/users",userRoutes)

export default router