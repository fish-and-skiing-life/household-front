import Full from 'Container/Full'

// dashboard components
const Statistics = () => import('Views/other/statistics');
const UserInfo = () => import('Views/other/userInfo');
const Group = () => import('Views/other/group');



export default {
   path: "/:id/",
   component: Full,
   children: [
      {
         path: 'statistics',
         name: "Statistics",
         components: {default: Statistics },
         meta: {
            requiresAuth: true,
            title: '集計情報',
            breadcrumb: null
         }
      },
      {
         path: 'user-info',
         name: "UserInfo",
         components: {default: UserInfo },
         meta: {
            requiresAuth: true,
            title: 'ユーザー情報',
            breadcrumb: null
         }
      },
      {
         path: 'group',
         name: "Group",
         components: {default: Group },
         meta: {
            requiresAuth: true,
            title: 'グループ設定',
            breadcrumb: null
         }
      }
   ]
}
