import Vue from 'vue';
import App from './app.vue';
import './assets/styles/global.styl';
// 入口文件 创建一个root节点
const root = document.createElement('div');
document.body.appendChild(root);
// 创建一个vue实例 把App组件挂载到root节点上
new Vue({
  render:(h)=>h(App)
}).$mount(root) 