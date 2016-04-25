angular.module('starter.services', [])

  .factory('Stars', function () {
    var stars = [
      {
        "id": 16,
        "created_at": "2016-04-23 11:08:45",
        "updated_at": "2016-04-25 00:00:05",
        "user_id": 3,
        "star_id": 16,
        "is_notify": 1,
        "nickname": "ChuaN黄福全",
        "title": "ChuaN直播间 愤怒的主播",
        "avatar": "http://uc.douyutv.com/upload/avatar/001/55/79/53_avatar_big.jpg?rltime4",
        "cover": "http://rpic.douyucdn.cn/z1604/24/23/58718_160424235648.jpg",
        "platform": "DOUYU",
        "link": "http://www.douyu.com/58718",
        "info": null,
        "followers": 1,
        "serial": 58718,
        "is_live": 1,
        "began_at": "2016-04-24 22:10:04"
      },
      {
        "id": 8,
        "created_at": "2016-04-22 11:55:52",
        "updated_at": "2016-04-25 00:00:04",
        "user_id": 3,
        "star_id": 8,
        "is_notify": 1,
        "nickname": "安德罗妮丶",
        "title": "素材竞技场，3个12胜很快打完的。···",
        "avatar": "http://uc.douyutv.com/upload/avatar/000/40/88/12_avatar_big.jpg?rltime4",
        "cover": "http://rpic.douyucdn.cn/z1604/24/22/16789_160424221609.jpg",
        "platform": "DOUYU",
        "link": "http://www.douyu.com/16789",
        "info": null,
        "followers": 3,
        "serial": 16789,
        "is_live": 0,
        "began_at": "2016-04-24 19:10:03"
      },
      {
        "id": 13,
        "created_at": "2016-04-22 11:59:06",
        "updated_at": "2016-04-25 00:00:04",
        "user_id": 3,
        "star_id": 13,
        "is_notify": 1,
        "nickname": "trevor行云",
        "title": "拆尼斯逗比欢乐多",
        "avatar": "http://i3.pdim.gs/t015d26246d895b5079.jpg",
        "cover": "http://i8.pdim.gs/e07dd2b8882c81da6d1477dda696e79b/w338/h190.jpeg",
        "platform": "PANDA",
        "link": "http://www.panda.tv/10015",
        "info": null,
        "followers": 2,
        "serial": 10015,
        "is_live": 1,
        "began_at": "2016-04-24 18:33:06"
      },
      {
        "id": 14,
        "created_at": "2016-04-22 11:59:14",
        "updated_at": "2016-04-25 00:00:05",
        "user_id": 3,
        "star_id": 14,
        "is_notify": 1,
        "nickname": "瓦莉拉的小伙伴",
        "title": "瓦王战天梯冲分啦！",
        "avatar": "http://i1.pdim.gs/t018f5b32e6e545f11f.jpg",
        "cover": "http://i6.pdim.gs/af04628223e1b1673a1ea20e214371a8/w338/h190.png",
        "platform": "PANDA",
        "link": "http://www.panda.tv/10027",
        "info": null,
        "followers": 1,
        "serial": 10027,
        "is_live": 1,
        "began_at": "2016-04-24 21:30:05"
      },
      {
        "id": 4,
        "created_at": "2016-04-22 09:56:55",
        "updated_at": "2016-04-25 00:00:03",
        "user_id": 3,
        "star_id": 4,
        "is_notify": 1,
        "nickname": "王师傅",
        "title": "用一下马上就用不了的卡组们吧！",
        "avatar": "http://i1.pdim.gs/t01d3c874fd7a7ea92f.jpg",
        "cover": "http://i7.pdim.gs/eca3da657a85fe4e7d4aa52306aa2150/w338/h190.jpeg",
        "platform": "PANDA",
        "link": "http://www.panda.tv/10029",
        "info": null,
        "followers": 2,
        "serial": 10029,
        "is_live": 0,
        "began_at": "2016-04-24 17:00:02"
      },
      {
        "id": 9,
        "created_at": "2016-04-22 11:56:10",
        "updated_at": "2016-04-25 00:00:04",
        "user_id": 3,
        "star_id": 9,
        "is_notify": 1,
        "nickname": "女流66",
        "title": "明天周一，Sigh",
        "avatar": "http://uc.douyutv.com/upload/avatar/006/43/12/98_avatar_big.jpg?rltime4",
        "cover": "http://rpic.douyucdn.cn/z1604/24/17/156277_160424175421.jpg",
        "platform": "DOUYU",
        "link": "http://www.douyu.com/156277",
        "info": null,
        "followers": 2,
        "serial": 156277,
        "is_live": 0,
        "began_at": "2016-04-24 15:10:03"
      }
    ]
    return {
      online: function() {
        return stars;
      }
    };
  })

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
