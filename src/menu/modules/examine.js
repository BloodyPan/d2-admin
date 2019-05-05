export default {
  path: '/examine',
  title: '举报相关',
  icon: 'gavel',
  children: (pre => [
    { path: `${pre}inappropriate`, title: '举报详情', icon: 'stethoscope' }
  ])('/examine/')
}
