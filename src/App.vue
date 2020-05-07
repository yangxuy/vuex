<template>
    <div id="app">
        <span>学习时间：{{this.$store.state.count}}</span>
        <span>我的年龄：{{this.$store.getters.getAge}}</span>
        <!--        <span>我的名字：{{this.$store.state.a.name}}</span>-->
        <div>
            <button @click="handlerAdd">添加</button>
            <button @click="handlerDel">减少</button>
            <button @click="handlerAsync">异步</button>
        </div>
        <div id="nav">
            <router-link to="/">Home</router-link>
            |
            <router-link to="/about">About</router-link>
        </div>
        <router-view/>
    </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {};
  },
  methods: {
    handlerAdd() {
      this.$store.commit('addCount', 1);
    },
    handlerDel() {
      this.$store.commit('delCount', 1);
    },
    handlerAsync() {
      this.$store.dispatch('handlerDispatchCount', 2);
    }
  },
  created() {
    console.log(this.$store);
    console.log('create 子节点APP');
  },
  mounted() {
    console.log('mounted 子节点APP');
  }
};
</script>
<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>
