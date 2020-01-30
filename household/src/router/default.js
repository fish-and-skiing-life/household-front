import Full from 'Container/Full'

// dashboard components
const Ecommerce = () => import('Views/dashboard/Ecommerce');


export default {
   path: "/:id/",
   component: Full,
   children: [
      {
         path: 'dashboard',
         name: "dashboard",
         components: {default: Ecommerce },
         meta: {
            requiresAuth: true,
            title: 'message.ecommerce',
            breadcrumb: null
         }
      }
   ]
}
