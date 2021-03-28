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
                <h2>{{authors.name}}</h2>
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
      <div class="banner">
        <a :href="link" target="_blank" rel=""><img :src="image" alt=""></a>
      </div>
      <div class="curriculumList">
        <div class="curriculumCon" v-for="course in courselist" :key="course.cid">
          <div class="curriculum_le">
            <img :src="course.cover" alt="">
          </div>
          <div class="curriculum_ri">
            <div class="curTop">
              <div class="area">
                {{course.area}}
              </div>
              <div class="curObject">
                <div class="obje" v-for="object in course.object" :key="object.key">
                  {{object}}
                </div>
              </div>
            </div>
            <div class="curCon">
              <h2>{{course.title}}</h2>
              <p>{{course.desc}}</p>
            </div>
            <div class="authors">
              <div class="author" @click="showAuthor(course.authors)">
                <img v-for="author in course.authors" :key="author.key" :src="author.avatar" alt="">
              </div>
              <div class="authorTit" @click="showAuthor(course.authors)">
                <span v-for="author in course.authors" :key="author.key">{{author.name}}</span>
              </div>
              <div class="coueseNum">
                <span>{{course.chapter_num}}</span>课时
              </div>
            </div>
            <router-link target='_blank' :to="{name:'course',params:{cid:course.cid}}">
              <div class="price">
                <div class="priceNum">
                ¥{{course.price}}
                </div>
                <div class="toDetail">
                  <span>查看详情</span>
                  <img src="https://icon.doock.cn/assets/open.png" alt="">
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="footBox">
        <div class="footCon">
          <div class="footConLe">
            <img src="https://icon.doock.cn/assets/logo2.png" alt="">
            <h2>如果你在使用过程中有任何问题，请联系我们</h2>
            <h3><a href="https://support.qq.com/products/312502/blog/503858 " target="_blank" rel="">联系我们 →</a></h3>
          </div>
          <div class="footConRi">
            <div class="le">
              <h4>关于</h4>
              <ul>
                <li><a href="https://support.qq.com/products/312502/blog/503856 " target="_blank" rel="">关注我们</a></li>
                <li><a href="https://support.qq.com/products/312502/blog/503857 " target="_blank" rel="">课程合作</a></li>
                <li><a href="https://support.qq.com/products/312502/faqs-more/ " target="_blank" rel="">帮助中心</a></li>
                <li><a href="https://support.qq.com/products/312502/" target="_blank" rel="">意见反馈</a></li>
              </ul>
            </div>
            <div class="ri">
              <h4>友情链接</h4>
              <ul>
                <li v-for="link in friendlink" :key="link.key"><a :href="link.url" target="_blank" rel="">{{link.name}}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="copy-right">
          <div class="copyLe">
            <span><a href="https://beian.miit.gov.cn" target="_blank">京ICP备14030848号-4</a> </span>
          </div>
          <div class="copyRi">
            <span>COPYRIGHT © 2018-2020 DOOCK</span>
          </div>
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
  name: "index",
  metaInfo: {
    title: 'DOOCK读课-设计师入门进阶课堂', // set a title
    meta: [{                 // set meta
      name: 'keyWords',
      content: 'DOOCK读课'
    },
    {
        name: 'description',
        content: 'DOOCK读课-设计师入门进阶课堂'
      }
    ]
  },
  data() {
    return {
      image:'',
      link:'',
      friendlink:[],
      courselist:[],
      author:[],
      scroll:0,
      author_ms: false
    };
  },
  components: {
    "header-bar": Header,
    "login-pop":Login
  },
  methods: {
    //登录注册框显示状态
    showLogin(){
      this.$store.commit("changeshow",true)
    },
    // 关闭作者弹窗
    close(){
      document.body.removeAttribute("class","equipment-body");
      this.author_ms = false
    },
    showAuthor(item){
      this.author = item
      this.author_ms = true
      document.getElementsByTagName("body")[0].className="equipment-body";
    }
    // 页面滚动位置
    // handleScroll(){
    //   var scroll = document.documentElement.scrollTop||document.body.scrollTop
    //   this.scroll = scroll
    // }
  },
  created(){
    this.path = this.$route.name;
  },
  mounted() {
    // 监听页面滚动
    // window.addEventListener('scroll',this.handleScroll)
    
    // 获取课程信息列表
    home.index({
      // token:token,
    }).then(data => {
      if(data.data.code == '10000'){
        this.image = data.data.data.top.image
        this.link = data.data.data.top.link
        this.friendlink = data.data.data.friendlink
        this.courselist = data.data.data.courselists
      }else{
        this.$message.error('请求数据错误');
      }
    })
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
    .banner{
      font-size: 0;
      height: 655px;
      overflow: hidden;
      position: relative;
      a{
        img{
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
    .curriculumList{
      .curriculumCon{
        // transition: 0.3s;
        width: 1210px;
        height: 504px;
        margin: 0 auto;
        margin-top: 80px;
        box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.1);
        opacity: 0.98;
        position: relative;
        a{
          display: inline-block;
          text-decoration: none;
        }
        .curriculum_le{
          -webkit-transform: scale(1);
          transform: scale(1);
          // transition: transform 0.1s;
          // transition: transform-origin 0;
          font-size: 0;
          width: 840px;
          height: 504px;
          overflow: hidden;
          img{
            width: 100%;
            height: 504px;
          }
        }
        .curriculum_ri{
          -webkit-transform: scale(1);
          transform: scale(1);
          // transition: transform 0.1s;
          // transition: transform-origin 0;
          height: 100%;
          height: 504px;
          background-color: #fff;
          width: 370px;
          box-sizing: border-box;
          padding: 0 32px;
          position: absolute;
          right: 0;
          top: 0;
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
            font-size: 0;
            .author{
              cursor: pointer;
              font-size: 0;
              display: inline-block;
              vertical-align: middle;
              img{
                width: 26px;
                height: 26px;
                border: 3px solid #FFFFFF;
                border-radius: 32px;
                margin-left: -8px;
                font-size: 0;
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
            background: #FA6400;
            box-sizing: border-box;
            padding: 0 32px;
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
            .priceNum{            
              font-size: 30px;
              font-family: DINCond-Black;
              font-weight: bold;
              color: #FFFFFF;
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
    .footBox{
      margin-top: 120px;
      background: #0F0F0F;
      padding: 72px 86px 0 86px;
      .footCon{
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
        .footConLe{
          img{
            width: 102px;
          }
          h2{
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #818181;
            line-height: 21px;
            padding-top: 30px;
          }
          h3{
            padding-top: 15px;
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 21px;
            a{
              text-decoration: none;
              color: #FFFFFF;
            }
          }
        }
        .footConRi{
          font-size: 0;
          .le{
            display: inline-block;
            vertical-align: top;
            padding-right: 105px;
            h4{
              font-size: 15px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 700;
              color: #FFFFFF;
              line-height: 21px;
              padding-bottom: 25px;
            }
            ul{
              padding: 0;
              li{
                list-style: none;
                padding-bottom: 15px;
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #818181;
                line-height: 21px;
                a{
                  text-decoration: none;
                  color: #818181;
                }
              }
            }
          }
          .ri{
            display: inline-block;
            vertical-align: top;
            h4{
              font-size: 15px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 700;
              color: #FFFFFF;
              line-height: 21px;
              padding-bottom: 25px;
            }
            ul{
              padding: 0;
              li{
                list-style: none;
                padding-bottom: 15px;
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #818181;
                line-height: 21px;
                a{
                  text-decoration: none;
                  color: #818181;
                }
              }
            }
          }
        }
      }
      .copy-right{
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
        margin-top: 52px;
        padding-bottom: 28px;
        span{   
          font-size: 13px;
          font-family: GothamBook;
          font-weight: 400;
          color: #575757;
          line-height: 13px;
        }
        .copyLe{
          a{
            text-decoration: none;
            color: #575757;
          }
        }
      }
    }
  }
  @media screen and (max-width:1280px) {
    .content .banner{
      height: 490px;
    }
    .content .curriculumList .curriculumCon{
      width: 968px;
      height: 403px;
      .curriculum_le{
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
        -webkit-transform-origin: left top;
        transform-origin: left top;
      }
      .curriculum_ri{
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
        -webkit-transform-origin: right top;
        transform-origin: right top;
      }
    }
  }
  @media screen and (max-width:960px) {
    .content .banner{
      height: auto;
      a{
        img{
        position: static;
      }
      } 
      
    }
    .content .curriculumList .curriculumCon{
      width: 726px;
      height: 303px;
      .curriculum_le{
        -webkit-transform: scale(0.6);
        transform: scale(0.6);
        -webkit-transform-origin: left top;
        transform-origin: left top;
      }
      .curriculum_ri{
        -webkit-transform: scale(0.6);
        transform: scale(0.6);
        -webkit-transform-origin: right top;
        transform-origin: right top;
      }
    }

  }
  @media screen and (max-width:750px) {
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

    .content .curriculumList .curriculumCon{
      width: 100%;
      height: auto;
      .curriculum_le{
        -webkit-transform: scale(1);
        transform: scale(1);
      }
      .curriculum_ri{
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }
    .content .curriculumList .curriculumCon .curriculum_le,.content .curriculumList .curriculumCon .curriculum_le img{
      height: auto;
    }
    .content .curriculumList .curriculumCon .curriculum_ri{
      position: static;
      width: 100%;
      height: auto;
    }
    .content .curriculumList .curriculumCon,.content .curriculumList .curriculumCon a{
      min-height: auto;
    }
    .content .curriculumList .curriculumCon .curriculum_le{
      width: 100%;
    }
    .content .curriculumList .curriculumCon .curriculum_ri .curTop{
      padding-top: 20px;
    }
    .content .curriculumList .curriculumCon .curriculum_ri {
      padding-bottom: 66px;
    }
    
    .content{
      .curriculumList{
        padding: 0 15px;
        .curriculumCon{
          margin-top: 25px;
        }
      }
    } 
    .content .curriculumList .curriculumCon .curriculum_ri{
      padding: 0 20px;
      padding-bottom: 100px;
      .curTop{
        margin-top: 0;
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
        padding: 0 20px;
        height: 45px;
        line-height: 45px;
        .priceNum{
          font-size: 26px;
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
      .authors{
        padding: 0 20px;
        bottom: 60px;
        font-size: 0;
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
    }
    .content .footBox{
      margin-top: 40px;
      padding: 20px 20px 0 20px;
      .footCon{
        display: block;
        .footConLe{
          width: 100%;
          position: relative;
          img{
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 80px;
          }
          h2,h3{
            padding-left: 100px;
            padding-top: 0;
            text-align: justify;
            font-size: 14px;
          }
          h3{
            padding-top: 15px;
          }
        }
        .footConRi{
          padding-top: 20px;
          .le,.ri{
            margin: 5px 0;
            position: relative;
            padding-right: 0;
            width: 100%;
            h4{
              font-size: 14px;
              padding-bottom: 15px;
              position: absolute;
              left: 0;
            }
            ul{
              padding-left: 70px;
              li{
                font-size: 14px;
                display: inline-block;
                padding: 0 5px;
              }
            }
          }
          .ri{
            width: 100%;
          }
        }
      }
      .copy-right{
        margin-top: 20px;
        padding-bottom: 15px;
        display: block;
        .copyLe,.copyRi{
          font-size: 12px;
          text-align: center;
          padding: 5px 0;
        }
      }
    }
  }
</style>

