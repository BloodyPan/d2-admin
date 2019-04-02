export default {
  path: '/group',
  title: '圈子',
  icon: 'group',
  children: (pre => [
    { path: `${pre}create`, title: '圈子生成', icon: 'street-view' }
  ])('/group/')
}
