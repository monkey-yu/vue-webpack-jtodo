<template>
  <section class="real-app">
    <input class="add-input" type="text" autofocus="autofocus" placeholder="接下去要做什么" @keyup.enter="addTodo">
    <Item :todo="todo" v-for="todo in filteredTodos" :key="todo.id" @del="deletdTodo"/>
    <Tabs :filter="filter" :todos="todos" @toggle="toggleFilter" @clearAllCompleted="clearAllCompleted"></Tabs>
  </section>
</template>
<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id =0
export default {
  data(){
    return{
      todos:[],
      filter:'all'
    }
  },
  computed:{
    // 计算属性 如果状态是all,todos全部显示，否则显示 为选中状态下的todos 用过滤器
    filteredTodos(){
      if(this.filter === 'all'){
        return this.todos
      }
      // 让completed 为boolean值
      const completed = this.filter === 'completed'  
      return this.todos.filter(todo => completed === todo.completed)
    }
  },
  methods:{
    // 添加一条todo unshift 到todos数组中，unshift从头上添加
    addTodo(e){
      this.todos.unshift({
        id:id++,
        content:e.target.value.trim(),
        completed:false
      })
      e.target.value = ''
    },
    // @del 从子组件传递过来 id为从自组件传递过来的参数
    deletdTodo(id){
      // 删除id 匹配的这一条 从todos数组中
      this.todos.splice(this.todos.findIndex(todo => todo.id === id),1)
    },
    toggleFilter(state){
      this.filter = state
    },
    clearAllCompleted(){
      this.todos = this.todos.filter( todo =>!todo.completed)
    }
  },
  components:{
    Item,
    Tabs
  },

}
</script>

<style lang="stylus" scoped>
.real-app
    width: 600px;
    margin: 0 auto;
    box-shadow: 0 0 5px #666;
  .add-input 
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    line-height: 1.4em;
    border: none;
    outline: none;
    box-sizing: border-box;
    padding: 16px 16px 16px 36px;
    box-shadow: inset 0 -2px 1px rgba(0,0,0,0.3);
</style>