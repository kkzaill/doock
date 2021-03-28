<template>
  <div>
    <Vcode
      :show="isShow"
      :canvasWidth = canwi
      :canvasHeight = canhe
      @success="success"
      @close="closeCode"
    />
    <div v-show="show" class="loginBox">
      <div class="loginCon">
        <img @click="close" class="close" src="https://icon.doock.cn/assets/close.png" alt="">
        <h2>注册/登陆</h2>
        <el-form :model="ruleForm" status-icon :rules="rules" label-width="30px" ref="ruleForm"  class="demo-ruleForm">
          <el-form-item class="phoneBox" label="+86" prop="phone">
            <el-input placeholder="请输入手机号" v-model="ruleForm.phone" :validate-event="false" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="submitBox">
            <el-button type="primary" @click="submitForm('ruleForm')">获取验证码</el-button>
          </el-form-item>
        </el-form>
        <h3>登陆即表示同意 <span>用户协议</span><span>隐私政策</span></h3>
      </div>
    </div>
    <div v-if="codeShow" class="codeBox">
      <div class="codeCon">
        <img @click="closeCodeImg" class="close" src="https://icon.doock.cn/assets/close.png" alt="">
        <h2>输入验证码</h2>
        <h4>验证码已发送至<span>+86 {{ruleForm.phone}}</span></h4>
        <el-form :model="ruleCodeForm" status-icon :rules="rules" ref="ruleCodeForm"  class="demo-ruleForm">
          <el-form-item class="codeConBox" prop="code">
            <el-input placeholder="请输入验证码" maxlength="6" v-model="ruleCodeForm.code" :validate-event="false" autocomplete="off"></el-input>
            <h5 v-if="getCode">重新发送（<span>{{timeNum}}</span>s）</h5> 
            <h6 v-if="!getCode" ><span @click="getCodeAli">获取验证码</span></h6>
          </el-form-item>
          <el-form-item class="submitBox">
            <el-button type="primary" @click="submitCodeForm('ruleCodeForm')">登陆</el-button>
          </el-form-item>
        </el-form>
        <h3>登陆即表示同意 <span>用户协议</span><span>隐私政策</span></h3>
      </div>
    </div>
  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";
import home from "@/api/home/index";
export default {
  name: "loginPop",
  data() {
    // 验证手机号
    var validatePhone = (rule, value, callback)=>{
      if(value === ''){
        callback(new Error('手机号码不能为空!'));
      }else{
        let rgx = /^[1][3,4,5,7,8][0-9]{9}$/;
        if(value.match(rgx) == null){
          callback(new Error('请输入正确的手机号码！'));
        }
        callback()
      }
    }
    
    return {
      ruleForm: {
        phone: ''
      },
      ruleCodeForm: {
        code: ''
      },
      rules: {
        phone: [
          { validator: validatePhone, trigger: '' }
        ],
        code: [
          { required: true, message: '请输入验证码!', trigger: '' },
        ]
      },
      show:false,
      codeShow:false,
      isShow: false,
      getCode:true,
      timeNum:30,
      canwi:400,
      canhe:270
    };
  },
  components:{
    Vcode
  },
  mounted() {
    var deviceWidth = document.documentElement.clientWidth || window.innerWidth
    if (deviceWidth<750) {
      this.canwi = 300
      this.canhe = 200
    } else {
      this.canwi = 400
      this.canhe = 270
    }
  },
  watch:{
    '$store.state.loginpop.isShow':function(){ 
      if(this.$store.state.loginpop.isShow){
        document.getElementsByTagName("body")[0].className="equipment-body";
      }
      this.show = this.$store.state.loginpop.isShow
    }
  },
  methods: {
    // 判断是不是移动端
    _isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    // 获取验证码
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          home.bsms({
            mobile:this.ruleForm.phone,
          }).then(data => {
            console.log(data);
            
            if(data.data.code == '10000'){
              this.tt = data.data.data.tt
              this.isShow = true;
            }else{
              this.$message.error(data.data.data);
            }
          })
        } else {
          return false;
        }
      });
    },
    // 登录
    submitCodeForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          home.Weblogin({
            mobile:this.ruleForm.phone,
            code:this.ruleCodeForm.code
          }).then(data => {
            console.log(data);
            if(data.data.code == '10000'){
              console.log(data);
              this.$store.commit("changelogin",true)
              this.ruleForm.phone = ''
              this.ruleCodeForm.code=''
              this.codeShow = false;
              document.body.removeAttribute("class","equipment-body");
            }else{
              this.$message.error(data.data.data);
            }
          })
          // window.localStorage.setItem('userToken','asasasa')
          
        } else {
          return false;
        }
      });
    },
    // 用户通过了验证
    success(msg){
      this.isShow = false; // 通过验证后，需要手动隐藏模态框
      this.codeShow = true
      this.$store.commit("changeshow",false)
      document.getElementsByTagName("body")[0].className="equipment-body";
      // 请求获取验证码接口
      home.getCode({
        mobile:this.ruleForm.phone,
        tt:this.tt
      }).then(data => {
        if(data.data.code == '10000'){
          this.getCode = true
          this.timeNum = 30
          this.timer = setInterval(()=>{
            this.timeNum--
            if(this.timeNum===0){
              this.getCode = false
              clearInterval(this.timer)
            }
          },1000)
        }else{
          this.getCode = false
          this.$message.error(data.data.data);
        }
      })
    },
    // 用户点击遮罩层，应该关闭模态框
    closeCode(){
      this.isShow = false;
    },
    // 关闭获取验证码框
    close(){
      this.$store.commit("changeshow",false)
      document.body.removeAttribute("class","equipment-body");
      this.ruleForm.phone = ''
    },
    // 关闭输入验证码框
    closeCodeImg(){
      this.codeShow = false
      document.body.removeAttribute("class","equipment-body");
      clearInterval(this.timer)
      this.ruleForm.phone = ''
      this.ruleCodeForm.code = ''
    },
    getCodeAli(){
      this.isShow = true;
    }
  }
};
</script>

<style scoped lang='scss'>
  >>>.el-message{
    z-index: 99999999 !important;
  }
  .el-input >>> .el-input__inner{
    border: none;
    color: #000;
    font-size: 15px;
    font-family: GothamBook;
  }
  .el-form-item>>>.el-form-item__label{
    font-size: 15px;
    font-family: GothamBook;
    color: #222222;
  }
  .el-input >>> .el-input__inner::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #B1B1B1;
    font-size: 15px;
  }
  .el-input >>> .el-input__inner::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #B1B1B1;
    font-size: 15px;
  }
  .el-input >>> .el-input__inner:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #B1B1B1;
    font-size: 15px;
  }
  .el-input>>>.el-input__suffix{
    display: none;
  }
  .el-form-item{
    margin-bottom: 50px;
  }
  .el-form-item>>>.el-form-item__error{
    left: -30px;
    top: 110%;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F1463C;
    line-height: 18px;
  }
  .vue-puzzle-vcode{
    z-index: 102;
  }
  .vue-puzzle-vcode>>>.vue-auth-box_{
    top: 50%;
  }
  .submitBox{
    margin-bottom: 69px;
  }
  .submitBox>>>.el-form-item__content{
    margin-left: 0 !important;
  }
  .loginBox,.codeBox{
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
    .loginCon,.codeCon{
      width: 410px;
      position: absolute;
      background: #fff;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      margin: auto;
      padding: 0 67px;
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      box-sizing: border-box;
      h2{
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: #1A1A1A;
        line-height: 20px;
        padding-top: 42px;
        padding-bottom: 58px;
      }
      h4{
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1A1A1A;
        line-height: 21px;
      }
      h3{
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #818181;
        line-height: 16px;
        padding-bottom: 29px;
        a{
          text-decoration: none;
          color: #0F5BFF;
          padding-right: 11px;
        }
        span{
          color: #0F5BFF;
          padding-right: 11px;
        }
      }
      .phoneBox,.codeConBox{
        border-bottom: 1px solid #C9C8C8;
      }
      .el-button{
        width: 100%;
        height: 40px;
        background: #FA6400;
        box-shadow: 0px 8px 9px 0px rgba(250, 100, 0, 0.23);
        border-radius: 20px;
        border: none;
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        letter-spacing: 1px;
      }
    }
  }
  .codeBox .codeCon{
    .codeConBox{
      >>>.el-form-item__error{
        left: 0;
      }
      .el-input{
        display: inline-block;
        width: 50%;
      }
      .el-input>>>.el-input__inner{
        padding: 0;
      }
      h5,h6{
        display: inline-block;
        width: 48%;
        color: #B1B1B1;
        font-size: 15px;
        font-weight: 400;
        text-align: right;
        span{
          font-family: GothamBook;
          display: inline-block;
          width: 20px;
          text-align: center;
        }
      }
      h6{
        color: #FA6400;
        span{
          width: auto;
          cursor: pointer;
        }
      }
    }
    h2{
      padding-bottom: 8px;
    }
    h4{
      padding-bottom: 29px;
      span{
        font-family: GothamBook;
      }
    }
  } 
  @media screen and (max-width:750px){
    .el-input >>> .el-input__inner::-webkit-input-placeholder {
      font-size: 14px;
    }
    .el-input >>> .el-input__inner::-moz-placeholder {
      font-size: 14px;
    }
    .el-input >>> .el-input__inner:-ms-input-placeholder {
      font-size: 14px;
    }
    .loginBox .loginCon, .loginBox .codeCon, .codeBox .loginCon, .codeBox .codeCon{
      width: 320px;
      padding: 0 25px;
    }
    .loginBox .close, .codeBox .close{
      top: 10px;
      right: 10px;
    }
    .loginBox .loginCon h2, .loginBox .codeCon h2, .codeBox .loginCon h2, .codeBox .codeCon h2{
      font-size: 18px;
      padding-top: 30px;
      padding-bottom: 45px;
    }
    .el-form-item{
      margin-bottom: 35px;
    }
    .loginBox .loginCon h3, .loginBox .codeCon h3, .codeBox .loginCon h3, .codeBox .codeCon h3{
      padding-bottom: 20px;
    }
    .el-form-item>>> .el-form-item__error{
      font-size: 12px;
      top: 100%;
    }
    .el-form-item>>>.el-form-item__content{
      line-height: 36px;
    }
    .el-input>>> .el-input__inner{
      height: 36px;
      line-height: 36px;
      font-size: 14px;
    }
    .el-form-item>>> .el-form-item__label{
      line-height: 36px;
      font-size: 14px;
    }
    .vue-puzzle-vcode>>>.vue-auth-box_{
      padding: 10px;
    }
    .codeBox .codeCon h2{
      padding-bottom: 5px;
    }
    .codeBox .codeCon h4{
      font-size: 14px;
      padding-bottom: 19px;
    }
  }
</style>