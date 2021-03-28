<template>
  <div>
    <header-bar :path="path" @login="showLogin"></header-bar>
    <login-pop></login-pop>
    <div class="content">
      <div class="authorsBox" v-if="author_ms">
        <div class="authorsBox_con">
          <span class="roundBg"></span>
          <img @click="close" class="close" src="https://icon.doock.cn/assets/close.png" alt="">
          <h2>课程作者</h2>
          <ul>
            <li v-for="authors in author" :key="authors.key">
              <img class="avatar" :src="authors.avatar" alt="">
              <div class="authorCon">
                <h2>{{authors.author}}</h2>
                <h3>{{authors.desc}}</h3>
              </div>
              <a :href="authors.url" target="_blank" ><img class="urlIcon" src="https://icon.doock.cn/assets/authorUrl.png" alt=""></a>
            </li>
          </ul>
        </div>
      </div>
      <div class="fixBox">
        <div class="toTop">
          <el-backtop :visibility-height='400'><img src="https://icon.doock.cn/assets/top.png" alt=""></el-backtop>
        </div>
        <div class="feedback">
          <a href="https://support.qq.com/products/312502/" target="_blank"><img src="https://icon.doock.cn/assets/fankui.png" alt=""></a>
        </div>
      </div>
      <div v-show="isFlex" ref="price" class="price" :class="isFlex?'isFlex':'noFlex'">
        <div class="read" v-if="payment" @click="trialRead">
          免费试读
        </div>
        <div class="read readAll" v-else @click="trialRead">
          立即阅读
        </div>
        <div class="price_con" v-if="payment">
          <div class="priceNum">
            ¥{{priceNum}}
          </div>
          <div class="toDetail">
            <span>购买课程</span>
            <img src="https://icon.doock.cn/assets/open.png" alt="">
          </div>
        </div>
      </div>
      <div class="banner" ref="banner">
        <img :src="image" alt="">
        <div class="curriculumBox">
          <div class="curriculum_ri">
            <div class="curTop">
              <div class="area">
                {{area}}
              </div>
              <div class="curObject">
                <div class="obje" v-for="object in object" :key="object.key">
                  {{object}}
                </div>
              </div>
            </div>
            <div class="curCon">
              <h2>{{title}}</h2>
              <p>{{desc}}</p>
            </div>
            <div class="authors">
              <div class="author" @click="showAuthor">
                <img v-for="author in author" :key="author.key" :src="author.avatar" alt="">
              </div>
              <div class="authorTit" @click="showAuthor">
                <span v-for="author in author" :key="author.key">{{author.author}}</span>
              </div>
              <div class="coueseNum">
                <span>{{chapter_num}}</span>课时
              </div>
            </div>
            <div class="price">
              <div class="read" v-if="payment" @click="trialRead">
                免费试读
              </div>
              <div class="read readAll" v-else @click="trialRead">
                立即阅读
              </div>
              <div class="price_con" v-if="payment">
                <div class="priceNum">
                  ¥{{priceNum}}
                </div>
                <div class="toDetail">
                  <span>购买课程</span>
                  <img src="https://icon.doock.cn/assets/open.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main" ref="main">
        <div class="main_con">
          <ul ref="ulList">
            <li @click="catalog" :class="checked?'checked':''">目录</li>
            <li @click="brief" :class="!checked?'checked':''">简介</li>
          </ul>
          <div v-show="checked" class="chapter">
            <div class="chapter_list" v-for="chapter in chapter" :key="chapter.key">
              <h2>{{chapter.title}}</h2>
              <div class="sub_list" v-for="sub in chapter.sub" :key="sub.key">
                <router-link :to="{name:'chapter',params:{id:sub.id}}">
                  <div class="subId">
                    <span v-if="sub.sort.length < 2">{{
                      0 + sub.sort
                    }}</span>
                    <span v-if="sub.sort.length >= 2">{{
                      sub.sort
                    }}</span>
                  </div>
                  <div class="sub_con">
                    <h2 class="title">
                      <span>{{ sub.title }}</span>
                      <img class="lock" v-if="sub.payment == 1" src="https://icon.doock.cn/assets/lock.png" alt="" />
                      <img class="trialReading" v-if="sub.payment == 0" src="https://icon.doock.cn/assets/trialReading.png" alt="">
                    </h2>
                    <h3>{{ sub.subtitle }}</h3>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          <div ref="chapterBrief" v-show="!checked" class="chapterBrief" v-html="chapterBrief"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/header";
import Login from "../components/loginPop";
import home from "@/api/home/index";
export default {
  name: "course",
  metaInfo (res) {
    return {
      title: this.title + '-DOOCK读课',
      
    }
  },
  data() {
    return {
      image:'',
      link:'',
      area:'',
      object:[],
      title:'',
      desc:'',
      author:[],
      priceNum:'',
      checked:true,
      isFlex:false,
      chapter:[],
      chapterBrief:'',
      mainHeight:'',
      mainWidth:'',
      chapterBriefHeight:'',
      chapter_num:'',
      payment:'',
      author_ms:false,
      imgList:[],
      scaleNum:'',
      trialId:''
    };
  },
  components: {
    "header-bar": Header,
    "login-pop":Login
  },
  methods: {
    // 图片距离顶端高度
    offsetTop1(obj,newScale) {
      var t = obj.offsetTop*newScale;
      while (obj.offsetParent) {
        obj = obj.offsetParent;
        t = t + obj.offsetTop;
      }
      return t;
    },
    // 试读和立即阅读
    trialRead(){
      this.$router.push({
        name:'chapter',
        params:{id:this.trialId}
      })
    },
    // 简介滚动事件
    chaterScroll(){
      var newScale = this.scaleNum
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let cliHeight = window.innerHeight || document.documentElement.clienHeight || document.body.clientHeight;
      this.imgList.forEach(element=>{
        if (scrollTop + cliHeight > this.offsetTop1(element,newScale)){
          setTimeout(()=>{
            if(element.className == ''){
              var src = element.getAttribute('data-src')
              element.src = src
              element.className="loaded"
            }
          },500)
        }
      })
    },
    // 页面滚动事件
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let oneHeight = this.$refs.banner.offsetHeight;
      if(scrollTop>oneHeight +100){
        this.isFlex = true
      }else{
        this.isFlex = false
      }
    },
    onresize(){
      let cliWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if(cliWidth<=1280 && cliWidth>960){
        this.scaleNum = 0.8
        this.$refs.price.style.right = (cliWidth-this.mainWidth*0.8)/2 + 49*0.8 +'px'
        this.$refs.main.style.height = this.mainHeight*0.8 +'px'
        if(!this.checked){
          this.$refs.main.style.height = this.$refs.ulList.offsetHeight*0.8 + this.$refs.chapterBrief.offsetHeight*0.8 + 'px'
        }
      }else if(cliWidth<=960 && cliWidth>=750){
        this.scaleNum = 0.7
        this.$refs.price.style.right = (cliWidth-this.mainWidth*0.7)/2 + 49*0.7 +'px'
        this.$refs.main.style.height = this.mainHeight*0.7 +'px'
        if(!this.checked){
          this.$refs.main.style.height = this.$refs.ulList.offsetHeight*0.7 + this.$refs.chapterBrief.offsetHeight*0.7 + 'px'
        }
      }else{
        this.scaleNum = 1
        this.$refs.price.style.right = (cliWidth-this.mainWidth)/2 + 49 +'px'
        this.$refs.main.style.height = this.mainHeight +'px'
        if(!this.checked){
          this.$refs.main.style.height = this.$refs.ulList.offsetHeight + this.$refs.chapterBrief.offsetHeight + 'px'
        }
      }
    },

    showLogin(){
      this.$store.commit("changeshow",true)
    },
    // 目录简介切换
    catalog(){
      this.checked = true
    },
    brief(){
      this.checked = false
    },
    // 关闭作者列表
    close(){
      document.body.removeAttribute("class","equipment-body");
      this.author_ms = false
    },
    // 展示作者列表
    showAuthor(){
      this.author_ms = true
      document.getElementsByTagName("body")[0].className="equipment-body";
    },
  },
  watch: {
    checked:function () {  
      this.$nextTick(()=>{
        let cliWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if(!this.checked){
          window.addEventListener('scroll', this.chaterScroll);
          this.chaterScroll()
        }
        if(this.checked){
          this.onresize()
        }else{
          if(cliWidth<=1280 && cliWidth>960){
            setTimeout(()=> {
              this.$refs.main.style.height = this.$refs.ulList.offsetHeight*0.8 + this.$refs.chapterBrief.offsetHeight*0.8 + 'px'
            },0)
          }else if(cliWidth<=960 && cliWidth>=750){
            setTimeout(()=> {
              this.$refs.main.style.height = this.$refs.ulList.offsetHeight*0.7 + this.$refs.chapterBrief.offsetHeight*0.7 + 'px'
            },0)
          }else{
            setTimeout(()=> {
              this.$refs.main.style.height = this.$refs.ulList.offsetHeight + this.$refs.chapterBrief.offsetHeight + 'px'
            },0)
          }
        }
      })
    },
    chapter: function () {
      this.$nextTick(function () {
        this.mainHeight = this.$refs.main.offsetHeight;
        let cliWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if(cliWidth<=1280 && cliWidth>960){
          this.mainWidth = this.$refs.main.offsetWidth/0.8;
        }else if(cliWidth<=960 && cliWidth>=750){
          this.mainWidth = this.$refs.main.offsetWidth/0.7;
        }else{
          this.mainWidth = this.$refs.main.offsetWidth
        }
        this.onresize()
      })
    },
    chapterBrief:function(){
      var that = this
      this.$nextTick(()=>{
        var imgs = that.$refs.chapterBrief.querySelectorAll('img');
        var h5Node = that.$refs.chapterBrief.querySelectorAll('h5')
        h5Node.forEach(element =>{
          if(element.getElementsByTagName('img').length>=1){
            element.className = "imgTit"
          }else if(element.previousSibling.getElementsByTagName('img').length>=1 &&  element.getElementsByTagName('img').length==0){
            element.className = "imgMs"
          }
        })
        that.imgList = imgs 
        imgs.forEach(element => {
          let wi = element.getAttribute('data-wi')
          let he = element.getAttribute('data-he')
          element.src = 'data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + wi +'" height="'+ he +'"></svg>'
        });
      })
    }
  },
  created(){
    this.path = this.$route.name;
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.onresize);
    // 获取路由地址
    var cid = this.$route.params.cid
    this.cid = cid
    // 获取单个课程信息列表
    if(cid != undefined){
      home.course({
        cid:cid
      }).then(data => {
        if(data.data.code == '10000'){
          var result = data.data.data
          this.image = result.bg
          this.area = result.area
          this.author = result.author
          this.desc = result.desc
          this.object = result.object
          this.title = result.title
          // document.title = result.title 
          this.priceNum = result.price
          this.chapter = result.catalog
          let chapterList = JSON.parse(JSON.stringify(result.catalog))
          // 获取第一个免费章节id
          var idList = []
          for(let key in chapterList){
            if(chapterList[key].sub != undefined){
              for (const i in chapterList[key].sub) {
                if(chapterList[key].sub[i].payment == 0){
                  idList.push(chapterList[key].sub[i].id)
                }
              }
            }
          }
          this.trialId = idList[0]
          var newContent= result.courseBrief.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
        　　var newStr= match.replace(capture,'')
        　　return newStr;
          });
          this.chapterBrief = newContent
          this.chapter_num = result.chapter_num
          this.payment = result.payment
        }else{
          this.$message.error('请求数据错误');
        }
      })
    }
    
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('scroll', this.chaterScroll)
    window.removeEventListener('resize', this.onresize)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .content{
    background-color: #f5f5f5;
    .authorsBox{
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 101;
      background: rgba(0,0,0,0.3);
      .close{
        position: absolute;
        top: 20px;
        right: 20px;
        width: 20px;
        cursor: pointer;
      }
      .authorsBox_con{
        width: 410px;
        position: absolute;
        background: #fff;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        margin: auto;
        padding: 0 36px;
        padding-bottom: 4px;
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        box-sizing: border-box;
        overflow: hidden;
        .roundBg{
          position: absolute;
          width: 750px;
          height: 750px;
          left: -372px;
          top: -640px;;
          z-index: -1;
          border-radius: 400px;
          background: #f1f1f1;
        }
        h2{
          font-size: 20px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 700;
          color: #1A1A1A;
          line-height: 20px;
          padding-top: 36px;
          padding-bottom: 59px;
        }
        ul{
          padding: 0;
          li{
            box-sizing: border-box;
            list-style: none;
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            padding: 27px 0;
            -webkit-flex-direction: row;
            -moz-flex-direction: row;
            -ms-flex-direction: row;
            -o-flex-direction: row;
            flex-direction: row;
            -webkit-justify-content: center;
            justify-content: center;
            -moz-box-pack: center;
            -webkit--moz-box-pack: center;
            box-pack: center;
            -webkit-align-items: top;
            -moz-align-items: top;
            -ms-align-items: top;
            -o-align-items: top;
            align-items: top;
            border-bottom: 1px solid rgba(151, 151, 151, 0.13);
            .avatar{
              width: 50px;
              height: 50px;
              border-radius: 50px;
            }
            .urlIcon{
              width: 52px;
              transform: translateY(13px);
            }
            .authorCon{
              -webkit-box-flex: 1;
              -moz-box-flex: 1;
              -webkit-flex: 1;
              -ms-flex: 1;
              flex: 1;
              padding: 0 10px 0 15px;
              h2{
                padding: 0;
                padding-bottom: 6px;
                font-size: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 700;
                color: #1A1A1A;
                line-height: 20px;
              }
              h3{
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #818181;
                line-height: 21px;
                text-align: justify;
              }
            }
          }
          li:last-child{
            border-bottom: 0 solid #000;
          }
        }
      }
    }
    .price{
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      height: 66px;
      font-size: 0;
      box-sizing: border-box;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      -moz-box-pack: space-between;
      -webkit--moz-box-pack: space-between;
      box-pack: space-between;
      .read{
        cursor: pointer;
        display: inline-block;
        width: 138px;
        height: 100%;
        font-size: 15px;
        text-align: center;
        line-height: 66px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: #FFFFFF;
        background: #0F5BFF;
      }
      .price_con{
        cursor: pointer;
        box-sizing: border-box;
        background: #FA6400;
        width: 232px;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: center;
        justify-content: center;
        -moz-box-pack: center;
        -webkit--moz-box-pack: center;
        box-pack: center;
        align-items: center;
        -webkit-align-items: center;
        box-align: center;
        -moz-box-align: center;
        -webkit-box-align: center;
        height: 100%;
        .priceNum{            
          font-size: 30px;
          font-family: DINCond-Black;
          font-weight: bold;
          color: #FFFFFF;
          margin-right: 15px;
        }
        .toDetail{
          font-size: 0;
          span{
            display: inline-block;
            vertical-align: middle;
            font-size: 15px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #FFFFFF;
            line-height: 21px;
            padding-right: 10px;
          }
          img{
            vertical-align: middle;
            width: 20px;
          }
        }
      }
    }
    .isFlex{
      width: 344px;
      position: fixed;
      bottom: 0;
      left: auto;
      height: 56px;
      z-index: 98;
      -webkit-justify-content: flex-end;
      justify-content: flex-end;
      -moz-box-pack: flex-end;
      -webkit--moz-box-pack: flex-end;
      box-pack: flex-end;
      animation: showPrice 0.5s ease-in-out;
      .read{
        width: 121px;
        height: 56px;
        line-height: 56px;
        background: #0F5BFF;
        border-radius: 16px 0px 0px 0px;
      }
      .readAll{
        width: 100%;
        border-radius: 16px 16px 0px 0px;
        letter-spacing: 0.8px;
      }
      .price_con{
        width: 223px;
        height: 56px;
        background: #FFFFFF;
        box-shadow: 0px -5px 5px 0px rgba(0, 0, 0, 0.04);
        border-radius: 0 16px 0 0;
        opacity: 0.92;
        border-top: 1px solid rgba(151, 151, 151, 0.22);
        border-right: 1px solid rgba(151, 151, 151, 0.22);
        .priceNum{
          font-size: 24px;
          font-family: DINCond-Black;
          font-weight: bold;
          color: #FA6400;
          line-height: 30px;
          margin-right: 23px;
        }
        .toDetail{
          img{
            display: none;
          }
          span{
            font-size: 15px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #1A1A1A;
            line-height: 21px;
          }
        }
      }
    }
    @keyframes showPrice {
      from{
        opacity: 0;
      }
      to{
        opacity: 1;
      }
    }
    @keyframes hidePrice {
      from{
        opacity: 0;
      }
      to{
        opacity: 1;
      }
    }
    .banner{
      position: relative;
      font-size: 0;
      height: 710px;
      position: relative;
      overflow: hidden;
      &>img{
        width: 100%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
      .curriculumBox{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 665px;
        width: 1128px;
        margin: auto;
      }
      .curriculum_ri{
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: #fff;
        box-sizing: border-box;
        padding: 0 32px;
        width: 370px;
        min-height: 504px;
        .curTop{
          margin-top: 24px;
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-justify-content: space-between;
          justify-content: space-between;
          -moz-box-pack: space-between;
          -webkit--moz-box-pack: space-between;
          box-pack: space-between;
          align-items: center;
          -webkit-align-items: center;
          box-align: center;
          -moz-box-align: center;
          -webkit-box-align: center;
          .area{
            font-size: 15px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #1A1A1A;
            line-height: 21px;
            padding-left: 24px;
            position: relative;
          }
          .area::before{
            content: '';
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: #FA6400;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          .curObject{
            font-size: 0;
            .obje{
              display: inline-block;
              font-size: 15px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #1A1A1A;
              line-height: 10px;
              padding: 0 10px;
              border-right: 1px solid #C9C8C8;
            }
            .obje:last-child{
              border-right: none;
              padding-right: 0;
            }
          }
        }
        .curCon{
          padding-top: 32px;
          h2{
            font-size: 26px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #1A1A1A;
            line-height: 26px;
            text-align: justify;
          }
          p{
            padding-top: 22px;
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #818181;
            line-height: 30px;
            text-align: justify;
          }
        }
        .authors{
          position: absolute;
          width: 100%;
          left: 0;
          bottom: 104px;
          box-sizing: border-box;
          padding: 0 32px;
          .author{
            font-size: 0;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            img{
              width: 26px;
              height: 26px;
              border: 3px solid #FFFFFF;
              border-radius: 32px;
              margin-left: -8px;
            }
            img:first-child{
              margin-left: 0;
            }
          }
          .authorTit{   
            cursor: pointer;
            vertical-align: middle;
            display: inline-block;  
            font-size: 15px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #1A1A1A;
            line-height: 21px;
            margin-right: 19px;
            padding-left: 14px;
            span{
              margin-right: 10px;
            }
          }
          .coueseNum{
            vertical-align: middle;
            display: inline-block;
            font-size: 15px;
            color: #818181;
            line-height: 10px;
            padding-left: 12px;
            border-left: 1px solid #C9C8C8;
            span{
              font-family: GothamBook;
            }
          }
        }
        .price{
          position: absolute;
          width: 100%;
          bottom: 0;
          left: 0;
          height: 66px;
          font-size: 0;
          box-sizing: border-box;
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-justify-content: space-between;
          justify-content: space-between;
          -moz-box-pack: space-between;
          -webkit--moz-box-pack: space-between;
          box-pack: space-between;
          .read{
            cursor: pointer;
            display: inline-block;
            width: 138px;
            height: 100%;
            font-size: 15px;
            text-align: center;
            line-height: 66px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #FFFFFF;
            background: #0F5BFF;
          }
          .readAll{
            width: 100%;
            letter-spacing: 0.8px;
          }
          .price_con{
            cursor: pointer;
            box-sizing: border-box;
            background: #FA6400;
            width: 232px;
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-justify-content: center;
            justify-content: center;
            -moz-box-pack: center;
            -webkit--moz-box-pack: center;
            box-pack: center;
            align-items: center;
            -webkit-align-items: center;
            box-align: center;
            -moz-box-align: center;
            -webkit-box-align: center;
            height: 100%;
            .priceNum{            
              font-size: 30px;
              font-family: DINCond-Black;
              font-weight: bold;
              color: #FFFFFF;
              margin-right: 15px;
            }
            .toDetail{
              font-size: 0;
              span{
                display: inline-block;
                vertical-align: middle;
                font-size: 15px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 700;
                color: #FFFFFF;
                line-height: 21px;
                padding-right: 10px;
              }
              img{
                vertical-align: middle;
                width: 20px;
              }
            }
          }
        }
      }
    }
    .main{
      margin: 0 auto;
      width: 900px;
      background: #FFFFFF;
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
      border-radius: 1px;
      margin-top: 50px;
      .main_con{
        padding: 0 100px;
        box-sizing: border-box;
        width: 900px;
      }
      ul{
        padding: 0;
        font-size: 0;
        padding-top: 70px;
        padding-bottom: 55px;
        li{
          display: inline-block;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 700;
          color: #818181;
          line-height: 16px;
          margin-right: 47px;
          padding-bottom: 8px;
          cursor: pointer;
        }
        li.checked{
          color: #0F5BFF;
          border-bottom: 2px solid #0F5BFF;
        }
        li:last-child{
          margin-right: 0;
        }
      }
      .chapter{
        padding-bottom: 120px;
        .chapter_list{
          padding-bottom: 87px;
          h2{
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #1A1A1A;
            line-height: 22px;
            padding-bottom: 13px;
          }
          .sub_list{
            cursor: pointer;
            box-sizing: border-box;
            height: 64px;
            a{
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              padding: 17px 32px 0 29px;
              text-decoration: none;
              display: -webkit-box;
              display: -moz-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              display: flex;
              -webkit-flex-direction: row;
              -moz-flex-direction: row;
              -ms-flex-direction: row;
              -o-flex-direction: row;
              flex-direction: row;
              -webkit-align-items: top;
              -moz-align-items: top;
              -ms-align-items: top;
              -o-align-items: top;
              align-items: top;
            }
            
            .subId{
              font-size: 15px;
              font-family: GothamBook;
              font-weight: bold;
              color: #1A1A1A;
              line-height: 15px;
            }
            .sub_con{
              -webkit-box-flex: 1;
              -moz-box-flex: 1;
              width: 20%;
              -webkit-flex: 1;
              -ms-flex: 1;
              flex: 1;
              padding-left: 25px;
              h2{
                padding-bottom: 8px;
                line-height: 15px;
                font-size: 15px;
                position: relative;
                span{
                  font-size: 15px;
                  font-family: PingFangTC-Regular, PingFangTC;
                  font-weight: 400;
                  color: #1A1A1A;
                  line-height: 15px;
                }
                .lock{
                  width: 16px;
                  position: absolute;
                  top: 0;
                  right: 10px;
                }
                .trialReading{
                  width: 36px;
                  position: absolute;
                  top: 0;
                  right: 0;
                }
              }
              h3{
                font-size: 15px;
                font-family: GothamBook;
                color: #B1B1B1;
                line-height: 15px;
              }
            }
          }
          .sub_list:hover{
            background: #F9F9FC;
          }
        }
        .chapter_list:last-child{
          padding-bottom: 0;
        }
      }
      .chapterBrief{
        padding-bottom: 120px;
        >>> ul,>>> ol{
          padding-left: 28px;
          li{
            line-height: 1.8;
            font-size: 16px;
          }
        }
        >>>h1{
          font-size: 40px;
          line-height: 56px;
          color: #000;
          padding-bottom: 120px;
        }
        >>>h2{
          font-size: 30px;
          line-height: 42px;
          color: #000;
          padding-bottom: 20px;
        }
        >>>h3{
          font-size: 28px;
          line-height: 40px;
          color: #000;
          padding-bottom: 10px;
        }
        >>>h4{
          font-size: 26px;
          line-height: 37px;
          color: #000;
          padding-bottom: 10px;
        }
        >>>h5{
          font-size: 14px;
          line-height: 20px;
          color: #8c8c8c;
          padding-bottom: 70px;
        }
        >>>h5.imgMs{
          margin-top: -50px;
        }
        >>>h5.imgTit{
          margin-top: 0;
          img{
            margin-bottom: 20px;
            margin-top: 0;
          }
        }
        >>>p{
          font-size: 16px;
          line-height: 36px;
          min-height: 36px;
          color: #252525;
          margin-bottom: 20px;
          text-align: justify;
          br{
            display: none;
          }
        }
        >>>img{
          max-width: 688px !important;
          display: block;
          margin: 20px auto 70px;
          background-color: #f3f3f3;
          background-position: 50%;
          background-repeat: no-repeat;
          visibility: visible;
        }
        >>>img.loaded{
          background-image: none;
          background-color: transparent;
        }
      }
    }
  }
  @media screen and(max-width:1280px){
    .content{
      .isFlex{
        transform: scale(0.8);
        transform-origin: right bottom;
        -webkit-transform-origin: right bottom;
      }
      .banner{
        height: 530px;
        .curriculumBox{
          height: 530px;
          width: 900px;
        }
        .curriculum_ri{
          transform: scale(0.8);
          transform-origin: right bottom;
          -webkit-transform-origin: right bottom;
        }
      }
      .main{
        width: 720px;
        .main_con{
          transform: scale(0.8);
          transform-origin: left top;
          -webkit-transform-origin: left top;
        }
        
      }
    }
  }
  @media screen and(max-width:960px) {
    .content{
      .isFlex{
        transform: scale(0.7);
        transform-origin: right bottom;
        -webkit-transform-origin: right bottom;
      }
      .banner{
        height: 410px;
        .curriculumBox{
          height: 410px;
          width: 740px;
        }
        .curriculum_ri{
          transform: scale(0.65);
          transform-origin: right bottom;
          -webkit-transform-origin: right bottom;
        }
      }
      .main{
        width: 630px;
        .main_con{
          transform: scale(0.7);
          transform-origin: left top;
          -webkit-transform-origin: left top;
        }
      }
    }
  }
  @media screen and(max-width:750px){
    .content .authorsBox{
      .close{
        top: 10px;
        right: 10px;
      }
      .authorsBox_con{
        width: 320px;
        padding: 0 20px;
        padding-bottom: 10px;
        .roundBg{
          position: absolute;
          width: 700px;
          height: 700px;
          left: -350px;
          top: -632px;
          z-index: -1;
          border-radius: 400px;
          background: #f1f1f1;
        }
        h2{
          font-size: 18px;
          padding-top: 25px;
          padding-bottom: 25px;
        }
        ul{
          padding: 0;
          li{
            font-size: 0;
            padding: 15px 0;
            .avatar{
              width: 35px;
              height: 35px;
            }
            .urlIcon{
              width: 32px;
              transform: translateY(19px);
            }
            .authorCon{
              -webkit-box-flex: 1;
              -moz-box-flex: 1;
              -webkit-flex: 1;
              -ms-flex: 1;
              flex: 1;
              padding: 0 6px 0 10px;
              h2{
                padding: 0;
                padding-bottom: 4px;
                font-size: 15px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 700;
                color: #1A1A1A;
                line-height: 20px;
              }
              h3{
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #818181;
                line-height: 18px;
                text-align: justify;
              }
            }
          }
          li:last-child{
            margin-bottom: 0;
          }
        }
      }
    }
    .content .banner{
      height: auto;
      img{
        width: 100%;
        position: static;
      }
      .curriculumBox{
        box-sizing: border-box;
        padding: 0 15px;
        position: static;
        width: 100%;
        height: auto;
        margin-top: 10px;
        .curriculum_ri{
          width: 100%;
          position: static;
          transform: scale(1);
          padding: 0 20px;
          padding-bottom: 100px;
          min-height: auto;
          .curTop{
            margin-top: 0;
            padding-top: 20px;
            .area{
              font-size: 14px;
              padding-left: 18px;
            }
            .area:before{
              width: 9px;
              height: 9px;
            }
            .curObject{
              .obje{
                font-size: 14px;
                padding: 0 8px;
              }
            }
          }
          .price{
            padding: 0;
            height: 45px;
            line-height: 45px;
            .priceNum{
              font-size: 26px;
            }
            .price_con{
              flex: 1;
            }
            .toDetail{
              span{
                font-size: 13px;
                padding-right: 8px;
              }
              img{
                width: 18px;
              }
            }
            .read{
              line-height: 45px;
              font-size: 14px;
            }
          }
          .authors{
            padding: 0 20px;
            bottom: 60px;
            .authorTit{
              font-size: 14px;
              margin-right: 15px;
              padding-left: 10px;
            }
            .author{
              img{
                width: 24px;
                height: 24px;
                border: 2px solid #FFFFFF;
                margin-left: -10px;
              }
              img:first-child{
                margin-left: 0;
              }
            }
            .coueseNum{
              font-size: 14px;
            }
          }
          .curCon{
            padding-top: 25px;
            h2{
              font-size: 20px;
            }
            p{
              font-size: 14px;
              min-height: 100px;
              padding-top: 15px;
              line-height: 26px;
              overflow: hidden;
            }
          }
        }
      }
    }
    .content .main{
      box-sizing: border-box;
      background: none;
      width: 100%;
      height: auto !important;
      margin-top: 20px;
      padding: 0 15px;
      .main_con{
        width: 100%;
        transform: scale(1);
        background: #fff;
        padding: 0 20px;
        ul{
          padding-top: 35px;
          padding-bottom: 25px;
          li{
            font-size: 16px;
            margin-right: 35px;
            padding-bottom: 5px;
          }
        }
        .chapter{
          padding-bottom: 60px;
          .chapter_list{
            padding-bottom: 30px;
            h2{
              font-size: 16px;
              padding-bottom: 8px;
            }
            .sub_list{
              height: 48px;
              a{
                padding: 10px 0 0 20px;
                height: 45px;
              }
              
              .subId{
                font-size: 14px;
                line-height: 13px;
                padding-top: 1px;
              }
              .sub_con{
                padding-left: 15px;
                h2{
                  font-size: 14px;
                  line-height: 13px;
                  padding-bottom: 5px;
                  span{
                    font-size: 14px;
                    line-height: 13px;
                  }
                  .lock{
                    width: 14px;
                    right: 9px;
                  }
                  .trialReading{
                    width: 32px;
                  }
                }
                h3{
                  font-size: 14px;
                  line-height: 13px;
                }
              }
            }
          }
        }
      }
    }
    .content .isFlex{
      transform: scale(1);
      right: 0 !important;
      left: 0;
      margin: auto;
      height: 44px;
      width: 100%;
      .read{
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        border-radius: 10px 0px 0px 0px;
        width: 130px;
      }
      .readAll{
        width: 100%;
        border-radius: 10px 10px 0px 0px;
      }
      .price_con{
        height: 44px;
        line-height: 44px;
        border-radius: 0 10px 0 0;
        flex: 1;
        .priceNum{
          font-size: 20px;
          line-height: 20px;
          margin-right: 15px;
        }
        .toDetail{
          span{
            font-size: 14px;
            padding-right: 0;
          }
        }
      }
    }
    .content .main .chapterBrief{
      line-height: 1.8;
      >>> ul,>>> ol{
        padding-left: 24px;
        li{
          line-height: 1.8;
          font-size: 14px;
        }
      }
      >>>h1{
        font-size: 32px;
        line-height: 40px;
        color: #000;
        padding-bottom: 60px;
      }
      >>>h2{
        font-size: 26px;
        line-height: 30px;
        color: #000;
        padding-bottom: 20px;
      }
      >>>h3{
        font-size: 22px;
        line-height: 30px;
        color: #000;
        padding-bottom: 10px;
      }
      >>>h4{
        font-size: 18px;
        line-height: 28px;
        color: #000;
        padding-bottom: 10px;
      }
      >>>h5{
        font-size: 14px;
        line-height: 20px;
        color: #8c8c8c;
        padding-bottom: 40px;
      }
      >>>h5.imgMs{
        margin-top: -50px;
      }
      >>>h5.imgTit{
        margin-top: 0;
        img{
          margin-bottom: 20px;
          margin-top: 0;
        }
      }
      >>>p{
        font-size: 16px;
        line-height: 1.8;
        min-height: 20px;
        color: #252525;
        margin-bottom: 15px;
        text-align: justify;
        br{
          display: none;
        }
      }
      >>>img{
        max-width: 100% !important;
        display: block;
        margin: 15px auto 40px;
        background-color: #f3f3f3;
        background-position: 50%;
        background-repeat: no-repeat;
        visibility: visible;
      }
    }
  }
</style>

