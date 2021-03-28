<template>
  <div class="headerBox" :class="path == 'index' || path == 'course' || path == ''?'home_headerBox':'chapter_header'">
    <div class="headerCon">
      <div class="headerLe" :class="collapsed?'logo-collapse-width':'logo-width'">
        <img @click="toIndex" class="homeLogo" v-if="path == 'index' || path == 'course'" src="https://icon.doock.cn/assets/logo1.png" alt />
        <img @click="toIndex" class="chapterLogo" v-else src="https://icon.doock.cn/assets/logo3.png" alt="">
      </div>
      <div v-if="path == 'chapter'" class="headerChangeCon" :class="collapsed?'ratateImg':''" @click.prevent="collapse">
        <img src="https://icon.doock.cn/assets/collapsed.png" alt="">
      </div>
      <div class="headerRi" :class="path == '/index'?'home_header':''">
        <div v-if="!isLogin" @click="login" class="login">
          <span v-if="path == 'chapter'">登陆</span><span v-else>注册</span><label v-if="path == 'chapter'">|</label><label v-else>/</label><span v-if="path == 'chapter'">注册</span><span v-else>登录</span>
        </div>
        <div v-if="isLogin" class="userImg">
          <img src="https://icon.doock.cn/assets/touxiang.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "headerNav",
  data() {
    return {
      isLogin:false,
      collapsed:false
    };
  },
  props: ["path","changeCollapsed"],
  watch:{
    '$store.state.islogin.isLogin':function(){ 
      this.isLogin = this.$store.state.islogin.isLogin
    },
    // 监听父组件collapsed变化
    changeCollapsed:function () {  
      this.collapsed = this.changeCollapsed
    }
  },
  mounted() {
    window.addEventListener('resize', this.onresize);
    let cliWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(cliWidth<750){
      this.collapsed = true
    }else{
      this.collapsed = false
    }
    if(window.localStorage.getItem("userToken")!==null){
      this.isLogin = true
    }
  },
  methods: {
    toIndex(){
      this.$router.push({
        name:'index',
      })
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
    login(){
      this.$emit('login')
    },
    collapse:function(){
      this.collapsed=!this.collapsed;
      this.$emit('iscollapse',this.collapsed)
    },
  }
};
</script>

<style scoped lang='scss'>
.headerCon {
  height: 60px;
  background: #ffffff;
  padding: 0 30px;
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
  position: relative;
  .headerChangeCon {
    position: absolute;
    right: 130px;
    
  }
  .headerLe{
    font-size: 0;
    transition: width 0.3s;
    img{
      cursor: pointer;
    }
    .homeLogo{
      width: 222px;
    }
    .chapterLogo{
      width: 22px;
    }
  }
  .headerRi {
    .login{     
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 15px;
      letter-spacing: 2px;
      cursor: pointer;
       
    }
    .userImg{
      width: 30px;
      height: 30px;
      font-size: 0;
      img {
        width: 100%;
        border-radius: 30px;
      }
    }
  }
}
.home_headerBox{
  // mix-blend-mode: exclusion;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  .headerCon{
    background: transparent;

  }
}
.chapter_header{
  .headerCon{
    padding-left: 0;
    .logo-collapse-width{
      width: 79px;
      padding-left: 30px;
      box-sizing: border-box;
    }
    .logo-width{
      box-sizing: border-box;
      width: 268px;
      height: 60px;
      line-height: 60px;
      box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.1);
      position: relative;
      img{
        position: absolute;
        left: 30px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .headerChangeCon{
      position: static;
      flex: 1;
      padding-left: 20px;
      font-size: 0;
      img{
        width: 26px;
        cursor: pointer;
        transition: all 0.3s;
      }
    }
    .headerRi{
      .login{
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1A1A1A;
        line-height: 13px;
        label{
          display: inline-block;
          height: 10px;
          margin: 0 8px;
          overflow: hidden;
          color: #C9C8C8;
        }
      }
    }
    .ratateImg{
      img{
        transform: rotateY(180deg);
      }
    }
  }
  
}
@media screen and (max-width:750px) {
  .headerCon{
    height: 50px;
    padding: 0 15px;
    .headerLe{
      .homeLogo{
        width: 130px;
      }
    }
  }
  .headerCon .headerRi .login{
    font-size: 14px;
    span{
      font-size: 15px;
    }
  }
  .chapter_header .headerCon .logo-collapse-width{
    padding-left: 15px;
  }
  .headerCon .headerLe .chapterLogo{
    width: 22px;
  }
  .chapter_header .headerCon .logo-collapse-width{
    width: 54px;
  }
  .chapter_header .headerCon .ratateImg img{
    width: 24px;
  }
  .chapter_header .headerCon .headerChangeCon{
    padding-left: 0;
  }
  .chapter_header .headerCon .logo-width{
    box-sizing: border-box;
    padding-left: 15px;
    height: auto;
    line-height: 1;
    width: 54px;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
  }
  .chapter_header .headerCon .logo-width img{
    position: static;
    transform: translateY(0);
  }
  .chapter_header .headerCon .headerChangeCon img{
    width: 26px;
  }
}
</style>