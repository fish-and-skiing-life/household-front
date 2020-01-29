

import Full from 'Container/Full'
// dashboard components
const householdCreate = () => import('Views/household/householdCreate');
const household = () => import('Views/household/household');



export default {
   path: "/:id/",
   component: Full,
   children: [
      {
         path: 'household/create',
         name: "householdCreate",
         components: {default: householdCreate },
         meta: {
            title: '家計簿作成画面',
            requiresAuth: true,
            breadcrumb: [
              {
                breadcrumbInactive: 'Tables /'
              },
              {
                breadcrumbActive: 'Standard'
              }
            ]
         },
      },
      {
         path: 'household/:h_id',
         name: "householdDetail",
         components: {default: household },
         meta: {
            title: '詳細画面',
            requiresAuth: true,
            breadcrumb: [
              {
                breadcrumbInactive: 'Tables /'
              },
              {
                breadcrumbActive: 'Standard'
              }
            ]
         },
      },
      {
         path: 'household/:h_id/edit',
         name: "householdEdit",
         components: {default: householdCreate },
         meta: {
            title: '家計簿編集画面',
            requiresAuth: true,
            breadcrumb: [
              {
                breadcrumbInactive: 'Tables /'
              },
              {
                breadcrumbActive: 'Standard'
              }
            ]
         },
      },
   ]
}
