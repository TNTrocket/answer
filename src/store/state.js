const state = {
  count: 3,
  wHeight: 572,
  wWidth: 360,
  versionSure: 1, // 微信版本检查 1/0：合格，-1：不合格
  onceSend: true, // formId发送，每次打开只发送一次
  userType: '2', // 1:教师；2：学生；3：游客
  wxUserInfo: {}, // 微信用户信息
  userInfo: {}, // 小程序用户信息
  userData: {}, // 用户记录
  shareOpenid: '', // 分享者openid或loginid
  shareStatus: '0', // 游客分享状态： 0：分享少于三个，闯关消耗钻石； 1：分享足够闯关不耗钻石
  diamonds: 0, // 钻石：游客角色专有
  userGrade: '', // 用户年级
  cgGrade: '' // 闯关年级， 默认为用户年级
}

export default state
