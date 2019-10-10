export default {
  path: '/settings',
  title: '线上设置',
  icon: 'cog',
  children: (pre => [
    {
      path: `${pre}android`,
      title: '安卓更新',
      icon: 'android'
    },
    {
      path: `${pre}camera-filters`,
      title: '滤镜配置',
      icon: 'camera'
    }
  ])('/settings/')
}
