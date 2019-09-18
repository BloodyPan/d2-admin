export default {
  path: '/examine',
  title: '举报相关',
  icon: 'gavel',
  children: (pre => [
    {
      path: `${pre}inappropriate`,
      title: '举报详情',
      icon: 'stethoscope'
    },
    {
      path: `${pre}nickname`,
      title: '敏感昵称',
      icon: 'user-times'
    },
    {
      path: `${pre}music`,
      title: '音乐表情包',
      icon: 'music'
    },
    {
      path: `${pre}taboo`,
      title: '敏感词管理',
      icon: 'ban'
    }
  ])('/examine/')
}
