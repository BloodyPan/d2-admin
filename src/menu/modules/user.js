export default {
  path: '/user',
  title: '用户相关',
  icon: 'user',
  children: (pre => [
    { path: `${pre}chat`, title: '官方回复', icon: 'slack' },
    { path: `${pre}data-visor`, title: 'DataVisor', icon: 'th-list' },
    { path: `${pre}white-list`, title: '白名单', icon: 'file-word-o' },
    { path: `${pre}vip`, title: 'VIP用户', icon: 'vimeo' },
    { path: `${pre}renew-user`, title: '重置测试号', icon: 'refresh' },
    { path: `${pre}user-locate`, title: '修改定位', icon: 'map-marker' }
  ])('/user/')
}
