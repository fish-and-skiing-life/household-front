import Full from 'Container/Full'

// dashboard components
const Ecommerce = () => import('Views/dashboard/Ecommerce');
const setting = () => import('Views/setting');


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
      },
      {
         path: 'setting',
         name: "setting",
         components: {default: setting },
         meta: {
            requiresAuth: true
         }
      }
   ]
}
