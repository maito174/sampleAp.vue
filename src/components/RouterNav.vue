<template>
  <div>
    <h2>Sample Application (Vue.js + APS.NET Web API)</h2>
    <ul>
      <li><router-link to="/">トップ</router-link></li>
      <li><router-link to="/employee/employeeTypeList">従業員区分/一覧</router-link></li>
      <li><router-link to="/employee/employeeTypeDetails">従業員区分/明細</router-link></li>
      <li><router-link to="/employee/employeeTypeCreate">従業員区分/新規登録</router-link></li>
      <li><router-link to="/employee/employeeTypeEdit">従業員区分/編集</router-link></li>
      <li><router-link to="/employee/employeeTypeDelete">従業員区分/削除</router-link></li>
    </ul>
    <hr />
    <router-view />
  </div>
</template>

<script setup lang="ts">
  // CSSのインポートはVueの<style>タグに移行するか、
  // main.ts/jsなどのエントリポイントでグローバルにインポートします。
  //import '../assets/RouterNav.css';
</script>

<style scoped>
    /*
    RouterNav.css の内容をここに直接記述することもできます。
    例:
    ul {
      list-style: none;
      padding: 0;
    }

    li {
      margin-bottom: 5px;
    }

    a {
      text-decoration: none;
      color: blue;
    }

    a.router-link-active {
      font-weight: bold;
      color: green;
    }
  */
</style>
