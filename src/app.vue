<template>
    <div id="app">
        <div class="cover"></div>
        <Header></Header>
        <Todo></Todo>
        <Footer></Footer>
    </div>
</template>
<script>
import Header from './todo/header.vue'
import Footer from './todo/footer.jsx'
import Todo from './todo/todo.vue'
export default {
    data(){
        return {
            
        }
    },
    components:{
        Header,
        Footer,
        Todo
    }
}
</script>

<style lang="stylus" scoped>
// stylus 是一种css的预编译器
#app
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    #cover
        position absolute
        left 0
        right 0
        top 0
        bottom 0   
        background-color #999 
        opacity 0.2
        z-index -1
</style>