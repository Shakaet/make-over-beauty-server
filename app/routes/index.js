import { Router } from "express"


import { userRoutes } from "../modules/user/user.route.js"
import { productRoutes } from "../modules/product/product.routes.js"
import { postRoutes } from "../modules/post/post.route.js"
import { addToCartRoutes } from "../modules/addTocart/addTocart.route.js"
import { couponRoutes } from "../modules/coupon/coupon.route.js"
import path from "path"
import { orderRoutes } from "../modules/order/order.route.js"


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
    path:"/coupons",
    routes:couponRoutes
  },
  {
    path:"/orders",
    routes:orderRoutes
  }
]

AllRoutes.forEach(route => router.use(route.path, route.routes))


// router.use("/users",userRoutes)

export default router