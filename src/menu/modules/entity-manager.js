export default {
  path: '/entity',
  title: '校园故事',
  icon: 'camera',
  children: (pre => [
    { path: `${pre}manager`, title: '内容管理', icon: 'film' }
  ])('/entity/')
}
