import { createRouter, createWebHistory } from 'vue-router'
import EmployeeTypesList from '../components/employeeType/EmployeeTypesList.vue'

// const BASE_URL = '/cadgd.vue/'
const BASE_URL = import.meta.env.BASE_URL

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes: [
    {
      path: '/employee/employeeTypeList',
      name: 'employeeTypeList',
      component: EmployeeTypesList,
    },
    {
      path: '/employee/employeeTypeDetails',
      name: 'employeeTypeDetails',
      // 明細ページはクエリパラメータを持つため、動的ルートにするか、
      // コンポーネント内でuseRoute().queryで取得する必要があります。
      // RouterNavのリンクが`/employeeTypeDetails?code=${employeeType.code}`のように
      // クエリパラメータを使うのであれば、ここはシンプルなパスでOKです。
      component: () => import('../components/employeeType/EmployeeTypeDetails.vue'),
    },
    {
      path: '/employee/employeeTypeCreate',
      name: 'employeeTypeCreate',
      component: () => import('../components/employeeType/EmployeeTypeCreate.vue'),
    },
    {
      path: '/employee/employeeTypeEdit/:code', // 動的セグメントでコードを受け取る
      name: 'employeeTypeEdit',
      component: () => import('../components/employeeType/EmployeeTypeEdit.vue'),
      props: true, // propsとして:codeをコンポーネントに渡す
    },
    {
      path: '/employee/employeeTypeDelete/:code', // 動的セグメントでコードを受け取る
      name: 'employeeTypeDelete',
      component: () => import('../components/employeeType/EmployeeTypeDelete.vue'),
      props: true,
    },
  ],
})

export default router
