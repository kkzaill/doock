<template>
  <el-row class="container content">
    <div class="fixBox">
        <div class="toTop">
          <el-backtop target='.overBox' :visibility-height='400'><img src="https://icon.doock.cn/assets/top.png" alt=""></el-backtop>
        </div>
        <div class="feedback">
          <a href="https://support.qq.com/products/312502/" target="_blank"><img src="https://icon.doock.cn/assets/fankui.png" alt=""></a>
        </div>
      </div>
    <login-pop></login-pop>
		<el-col :span="24" class="header">
			<header-bar :changeCollapsed="collapsed" :path="path" @login="showLogin" @iscollapse="collapse" ></header-bar>
		</el-col>
		<el-col :span="24" class="main">
      <div class="coverBg" @click="hideSlide" v-if="!collapsed"></div>
			<aside class="asideBox" :class="collapsed?'menu-collapsed':'menu-expanded'">
        <div class="unlocking">
          <img src="https://icon.doock.cn/assets/lock1.png" alt="">
          <span>解锁全部课程</span>
        </div>
        <!--导航菜单-->
        <el-menu class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
          unique-opened router>
          <div class="chapter">
            <div class="chapter_list" v-for="chapter in chapter" :key="chapter.key">
              <h2>{{chapter.title}}</h2>
              <div class="sub_list" :class= "sub.id == id ?'active': ''" @click="checkChapter(sub)" v-for="sub in chapter.sub" :key="sub.key">
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
                    <img class="trialReading" v-else src="https://icon.doock.cn/assets/trialReading.png" alt="">
                  </h2>
                  <h3>{{ sub.subtitle }}</h3>
                </div>
              </div>
            </div>
          </div>
        </el-menu>
			</aside>
			<section class="content-container overBox" @scroll="scrollEvent" ref="contentBox">
				<div class="grid-content bg-purple-light" :class="payment == 1?'showPay':''">
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
              <div class="thumbs_box">
                <div v-if="noChapter" class="chapterBrief">
                  <div ref="chapterBrief"  v-html="detail"></div>
                  <div class="thumbs_con" v-if="payment != 1">
                    <div class="thumbs" @click="thumbs">
                      <img src="https://icon.doock.cn/assets/thumbs_p.png" alt="">
                    </div>
                    <h2>赞（<span>{{hvala}}</span>）</h2>
                    <p>©版权归读课DOOCK所有，未经许可不可传播售卖，页面已增加防盗追踪，如有侵权将依法追究法律责任</p>
                  </div>
                  <div class="checkPage" v-if="payment != 1">
                    <ul>
                      <li @click="prevPage" :class="checkPage == 0?'noCheck':''">上一页</li>
                      <li @click="nextPage" :class="checkPage == 1?'noCheck':''">下一页</li>
                    </ul>
                  </div>
                  <div class="maskBox" v-if="payment == 1">
                    <div class="maskCon">
                      <h2>此章节为付费章节</h2>
                      <h3>现在购买立即解锁全部课程内容</h3>
                      <div class="unlocking">
                        <img src="https://icon.doock.cn/assets/lock1.png" alt="">
                        <span>购买课程 ¥</span>
                        <label>19.9</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
import Header from "../components/header";
import Login from "../components/loginPop";
import home from "@/api/home/index";
export default {
  name: "Index",
  data() {
    return {
      collapsed:false,
      chapter:[],
      detail:'',
      imgList:[],
      id:'',
      cid:'',
      hvala:'',
      idList:[],
      checkPage:'',
      pageNum:'',
      noChapter:true,
      hvalaNum: 1,
      addhvalaNum:true,
      payment:'',
      title:'',
      description:''
    };
  },
  components: {
    "header-bar": Header,
    "login-pop":Login
  },
  computed:{
    
  },
  metaInfo() {
    return{
      title: this.title,
      meta: [{
        name: "keywords",
        content: 'DOOCK读课'
      },{
        name: "description",
        content: this.description
      }]
    }
  },
  methods: {
    // 下一页
    nextPage(){
      if(this.pageNum>=this.idList.length){
        return false
      }
      this.id = this.idList[this.pageNum]
      this.pageNum++
      this.$router.push({
        name:'chapter',
        params:{id:this.id}
      })
    },
    // 上一页
    prevPage(){
      // this.pageNum = this.pageNum-1
      if(this.pageNum<=1){
        return false
      }else{
        this.pageNum = this.pageNum-1
      }
      this.id = this.idList[this.pageNum-1]
      this.$router.push({
        name:'chapter',
        params:{id:this.id}
      })
    },

    showLogin(){
      this.$store.commit("changeshow",true)
    },
    handleopen() {
      //console.log('handleopen');
    },
    handleclose() {
      //console.log('handleclose');
    },
    handleselect: function (a, b) {
    },
    collapse(val){
      this.collapsed = val
    },
    // 切换文章
    checkChapter(item){
      if(item.id != this.id){
        this.id = item.id
        this.$router.push({
          name:'chapter',
          params:{id:item.id}
        })
      }
      let cliWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if(cliWidth<750){
        this.collapsed = true
      }
    },
    // 点赞
    thumbs(){
      if(this.addhvalaNum){
        if(this.hvalaNum>10){
          this.addhvalaNum = false
          this.$message({
            message: '操作过于频繁，请稍后再试！',
            type: 'warning'
          });
          setTimeout(()=> {  
            this.addhvalaNum = true
            this.hvalaNum = 0
          },60000)
        }else{
          this.hvalaNum++
          this.hvala = parseInt(this.hvala)+1
          home.hvala({
            cid:this.cid,
            id:this.id
          }).then(data => {
            if(data.data.code != 10000){
              this.$message.error(data.data.data);
            }
          })
        }
      }else{
        this.$message({
          message: '操作过于频繁，请稍后再试！',
          type: 'warning'
        });
      }
      
    },
    // 图片距离顶端高度
    offsetTop1(obj) {
      var t = obj.offsetTop;
      while (obj.offsetParent) {
        obj = obj.offsetParent;
        t = t + obj.offsetTop;
      }
      return t;
    },
    // 懒加载
    lazyLoad(imgs) {
      var H = this.$refs.contentBox.clientHeight;//获取可视区域高度
      var S = this.$refs.contentBox.scrollTop
      imgs.forEach(element=>{
        if (H + S > this.offsetTop1(element)){
          setTimeout(()=>{
            if(element.className == ''){
              var src = element.getAttribute('data-src')
              element.src = src
              element.onload = function () {  
                element.className="loaded"
              }
            }
          },500)
        }
      })
    },
    // 页面滚动事件
    scrollEvent() {
      this.lazyLoad(this.imgList)
    },
    onresize(){
      let cliWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if(!this.collapsed){
        if(cliWidth<750){
          this.collapsed = true
        }else{
          this.collapsed = false
        }
      }
      
    },
    // 点击空白处隐藏silde
    hideSlide(){
      this.collapsed = true
    }
  },
  watch: {
    id:function(){
      this.$nextTick(()=>{
        this.pageNum = this.idList.indexOf(this.id) + 1
        if(this.pageNum == 0){
          this.noChapter = false
        }else{
          this.noChapter = true
        }
        if(this.idList.indexOf(this.id) === 0){
          this.checkPage = 0
        }else if(this.idList.indexOf(this.id) === this.idList.length-1){
          this.checkPage = 1
        }else{
          this.checkPage = 2
        }
        
        // 获取节文章
        home.chapter({
          // token:token,
          cid:this.cid,
          id:this.id,
          // pid:pid,
        }).then(data => {
          if(data.data.code == 10000){
            this.payment = data.data.data.payment
            this.title = data.data.data.title + '-DOOCK读课'
            if(data.data.data.content != null){
              var newContent= data.data.data.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
          　　  var newStr= match.replace(capture,'')
          　　  return newStr;
              });
            }
            this.detail = newContent
            this.hvala = data.data.data.hvala
          }else{
            this.$message.error('请求数据错误');
          }
        })
      })
    },
    detail:function(){
      var that = this
      this.$nextTick(()=>{
        if(this.noChapter){
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
          
          that.lazyLoad(that.imgList)
        }
      })
    }
  },
  created(){
    this.path = this.$route.name;
    let cliWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(cliWidth<750){
      this.collapsed = true
    }else{
      this.collapsed = false
    }
  },
  mounted() {
    window.addEventListener('resize', this.onresize);
    
    // 获取路由地址
    var cid = this.$route.params.cid
    var pid = this.$route.params.pid
    var id = this.$route.params.id
    
    this.cid = this.$route.params.cid
    // 获取节文章
    home.chapter({
      // token:token,
      cid:cid,
      id:id,
      // pid:pid,
    }).then(data => {
      if(data.data.code == 10000){
        this.title = data.data.data.title + '-DOOCK读课'
        this.payment = data.data.data.payment
        this.hvala = data.data.data.hvala
        this.chapter = data.data.data.catalog
        let chapterList = JSON.parse(JSON.stringify(data.data.data.catalog))
        var idList = []
        for(let key in chapterList){
           if(chapterList[key].sub != undefined){
             for (const i in chapterList[key].sub) {
               idList.push(chapterList[key].sub[i].id)
             }
           }
        }
        this.idList = idList
        this.pageNum = this.idList.indexOf(id)+1 
        if(this.pageNum == 0){
          this.noChapter = false
        }else{
          this.noChapter = true
        }
        if(this.idList.indexOf(id) === 0){
          this.checkPage = 0
        }else if(this.idList.indexOf(id) === this.idList.length-1){
          this.checkPage = 1
        }else{
          this.checkPage = 2
        }
        if(data.data.data.content != null){
          var newContent= data.data.data.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
        　　var newStr= match.replace(capture,'')
        　　return newStr;
          });
          this.detail = newContent
          this.id = this.$route.params.id
        }
      }else{
        this.$message.error('请求数据错误');
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id
    next()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .container {
    min-width: 1000px;
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.el-submenu [class^=el-icon-] {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: left;
		}
		.main {
			display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
      aside .el-menu::-webkit-scrollbar {
        display: none;
      }
			aside{
        position: relative;
        .unlocking{
          position: absolute;
          width: 193px;
          height: 39px;
          line-height: 39px;
          background: #FA6400;
          box-shadow: 0px 8px 9px 0px rgba(250, 100, 0, 0.23);
          border-radius: 23px;
          bottom: 18px;
          left: 0;
          right: 0;
          margin: auto;
          z-index: 100;
          text-align: center;
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          margin-bottom: 19px;
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
          -webkit-align-items: center;
          -moz-align-items: center;
          -ms-align-items: center;
          -o-align-items: center;
          align-items: center;
          img{
            width: 19px;
            background: #FA6400;
          }
          span{ 
            font-size: 13px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 700;
            color: #FFFFFF;
            line-height: 13px;
            letter-spacing: 1px;
            padding-left: 6px;
          }
        }
				.el-menu{
          // width: 268px;
					height: 100%;
          box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.1);
          border-right: 0;
          position: absolute;
          left: 0;
          top: 0;
          overflow-x: hidden;
          overflow-y: auto;
          
          .chapter{
            padding-top: 38px;
            padding-bottom: 120px;
            width: 286px;
            .chapter_list{
              padding-bottom: 69px;
              padding-left: 30px;
              padding-right: 32px;
              h2{        
                font-size: 13px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 700;
                color: #1A1A1A;
                line-height: 13px;
                padding-bottom: 27px;
              }
              .sub_list{
                cursor: pointer;
                box-sizing: border-box;
                height: 32px;
                box-sizing: border-box;
                display: -webkit-box;
                display: -moz-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                margin-bottom: 19px;
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
                .subId{
                  font-size: 13px;
                  font-family: GothamBook;
                  font-weight: bold;
                  color: #1A1A1A;
                  line-height: 13px;
                }
                .sub_con{
                  -webkit-box-flex: 1;
                  -moz-box-flex: 1;
                  -webkit-flex: 1;
                  -ms-flex: 1;
                  flex: 1;
                  padding-left: 12px;
                  margin-left: 8px;
                  h2{
                    padding-bottom: 6px;
                    line-height: 13px;
                    font-size: 13px;
                    position: relative;
                    padding-right: 40px;
                    span{
                      font-size: 13px;
                      font-family: Verdana,"Lantinghei SC","Hiragino Sans GB","Microsoft Yahei",Helvetica,arial,Simhei,"宋体",sans-serif;
                      font-weight: 400;
                      color: #1A1A1A;
                      line-height: 13px;
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
                    font-size: 13px;
                    font-family: GothamBook;
                    color: #B1B1B1;
                    line-height: 13px;
                    padding-right: 40px;
                    font-weight: normal;
                  }
                }
              }
              .sub_list.active{
                .subId{
                  color: #0F5BFF;
                }
                .sub_con{
                  box-sizing: border-box;
                  padding-left: 11px;
                  border-left: 1px solid #0F5BFF;
                  h2{
                    span{
                      color: #0F5BFF;
                      font-weight: bold;
                    }
                  }
                  h3{
                    color: #92B5FF;
                  }
                }
              }
              .sub_list:last-child{
                margin-bottom: 0;
              }
            }
            .chapter_list:last-child{
              padding-bottom: 0;
            }
          }
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
      .asideBox{
        transition: all 0.3s;
      }
			.menu-collapsed{
        transition: all 0.3s;
				flex:0 0 0;
				width: 0;
        overflow: hidden;
        .el-menu-vertical-demo{
          // width: 0 !important;
        }
			}
			.menu-expanded{
        overflow: hidden;
        transition: all 0.3s;
				flex:0 0 268px;
				width: 268px;
			}
			.content-container {
				// background: #f1f2f7;
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
				overflow-y: scroll;
				padding: 28px 28px 0 28px;
        .grid-content{
          height: 100%;
          position: relative;
          .maskBox{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            right: 0;
            top: 0;
            margin: auto;
            max-width: 888px;
            background-image: linear-gradient(to bottom,rgba(255, 255, 255, 0.54),rgba(255, 255, 255, 1));
            .maskCon{
              position: absolute;
              width: 100%;
              bottom: 62px;
              h2{
                font-size: 16px;
                font-family: PingFangTC-Medium, PingFangTC;
                font-weight: bold;
                color: #1A1A1A;
                line-height: 22px;
                text-align: center;
                padding-bottom: 9px;
              }
              h3{
                text-align: center;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #1A1A1A;
                line-height: 13px;
                padding-bottom: 17px;
              }
              .unlocking{
                width: 193px;
                height: 39px;
                background: #FA6400;
                box-shadow: 0px 8px 9px 0px rgba(250, 100, 0, 0.23);
                border-radius: 23px;
                margin: 0 auto;
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
                -webkit-justify-content: center;
                justify-content: center;
                -moz-box-pack: center;
                -webkit--moz-box-pack: center;
                box-pack: center;
                -webkit-align-items: center;
                -moz-align-items: center;
                -ms-align-items: center;
                -o-align-items: center;
                align-items: center;
                img{
                  margin: 0;
                  width: 19px;
                  background: #FA6400;
                }
                span{
                  padding-left: 13px;
                }
                span,label{
                  font-size: 13px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 700;
                  color: #FFFFFF;
                  line-height: 13px;
                  letter-spacing: 1px;
                }
                label{
                  font-family: GothamBook;
                }
              }
            }
          }
        }
        .showPay{
          overflow: hidden;
        }
				.content-wrapper {
          background: #F5F5F5;
					box-sizing: border-box;
          // height: 100%;
          padding-bottom: 28px;
          .chapterBrief{
             -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            box-sizing: border-box;
            padding: 56px 89px;
            max-width: 888px;
            margin: 0 auto;
            background: #FFFFFF;
            box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
            font-size: 16px;
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
            .thumbs_con{
              .thumbs{
                cursor: pointer;
                margin: 111px auto 0;
                width: 76px;
                height: 76px;
                background: #FA6400;
                box-shadow: 0px 8px 9px 0px rgba(250, 100, 0, 0.23);
                border-radius: 76px;
                position: relative;
                img{
                 width: 28px;
                 position: absolute;
                 left: 0;
                 right: 0;
                 top: 0;
                 bottom: 0;
                 margin: auto;
                 background: #FA6400;
                }
              }
              h2{
                text-align: center;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #101010;
                line-height: 18px;
                padding-top: 20px;
                padding-bottom: 0;
                span{
                  font-weight: bold;
                }
              }
              p{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #222222;
                line-height: 17px;
                padding-top: 47px;
                text-align: center;
                margin-bottom: 0;
              }
            }
            .checkPage{
              margin-top: 115px;
              ul{
                font-size: 0;
                padding: 0;
                text-align: center;
                li{
                  list-style: none;
                  display: inline-block;
                  vertical-align: top;
                  font-size: 13px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #222222;
                  line-height: 35px;
                  width: 93px;
                  height: 35px;
                  background: #F2F2F2;
                  border-radius: 25px;
                  text-align: center;
                  margin: 0 10px;
                  cursor: pointer;
                }
                li.noCheck{
                  background: none;
                  cursor: not-allowed;
                }
              }
            }
          }
				}
			}
			.menu-expanded ul{
			  // width:auto !important;
			}
		}
	}
  @media screen and (max-width: 1212px) {
    .container .main .content-container .content-wrapper .chapterBrief >>>img{
      max-width: 100% !important;
    }
  }
  @media screen and (max-width: 750px){
    .container{
      min-width: auto;
    }
    .container .main{
      top: 50px;
    }
    .container .main .content-container{
      padding: 20px 0 0 0;
    }
    .container .main .content-container .content-wrapper .chapterBrief{
      line-height: 1.8;
      padding: 30px 20px 40px 20px;
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
    .container .main .content-container .content-wrapper .chapterBrief .thumbs_con .thumbs{
      margin: 50px auto 0;
      width: 70px;
      height: 70px;
      img{
        width: 30px;
      }
    }
    .container .main .content-container .content-wrapper .chapterBrief .thumbs_con h2{
      font-size: 14px;
      padding-top: 10px;
    }
    .container .main .content-container .content-wrapper .chapterBrief .thumbs_con p{
      padding-top: 30px;
    }
    .container .main .content-container .content-wrapper .chapterBrief .checkPage{
      margin-top: 50px;
    }
    .container .main .content-container .content-wrapper .chapterBrief .checkPage ul li{
      font-size: 14px;
      width: 85px;
      height: 34px;
      line-height: 34px;
      margin: 0 6px;
    }
    .container .main .content-container .content-wrapper{
      padding-bottom: 0;
    }
    .container .main .content-container .grid-content .maskBox .maskCon{
      bottom: 25px;
      h2{
        font-size: 16px;
        line-height: 18px;
        padding-bottom: 5px;
      }
      h3{
        font-size: 14px;
        padding-bottom: 15px;
      }
    }
    .container .main .content-container .grid-content .maskBox .maskCon .unlocking{
      width: 200px;
      height: 40px;
      img{
        width: 20px;
      }
      span{
        padding-left: 8px;
        line-height: 14px;
      }
      span,label{
        font-size: 14px;
      }
    }
    .container .main aside .unlocking{
      margin-bottom: 0;
      bottom: 20px;
      width: 200px;
      height: 40px;
      img{
        width: 20px;
      }
      span{
        padding-left: 8px;
        line-height: 14px;
      }
      span,label{
        font-size: 14px;
      }
    }
    .container .main .coverBg{
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      position: absolute;
      z-index: 8;
      height: 100%;
    }
    .container .main .menu-expanded{
      flex: 0 0 260px;
      width: 260px;
    }
    .container .main .asideBox{
      position: absolute;
      height: 100%;
      z-index: 9;
    }
    .container .main aside .el-menu .chapter{
      padding-top: 25px;
      width: 260px;
      padding-bottom: 100px;
    }
    .container .main aside .el-menu .chapter .chapter_list{
      padding-bottom: 40px;
      padding-left: 20px;
      padding-right: 21px;
      h2{
        font-size: 14px;
        padding-bottom: 20px;
      }
    }
    .container .main aside .el-menu .chapter .chapter_list .sub_list{
      height: 30px;
      margin-bottom: 15px;
    }
    .container .main aside .el-menu .chapter .chapter_list .sub_list .subId{
      font-size: 14px;
    }
    .container .main aside .el-menu .chapter .chapter_list .sub_list .sub_con{
      padding-left: 8px;
      margin-left: 5px;
      h2{
        padding-bottom: 3px;
        span{
          font-size: 14px;
        }
        .trialReading{
          width: 32px;
        }
        .lock{
          width: 14px;
          right: 9px;
        }
      }
      h2,h3{
        font-size: 14px;
        padding-right: 35px;
      }
    }
    .container .main aside .el-menu .chapter .chapter_list .sub_list.active .sub_con{
      padding-left: 8px;
    }
  }
</style>

