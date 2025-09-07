<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
      <h1 class="text-2xl font-bold mb-4 text-gray-800">{{ title }}</h1>
      <hr class="mb-4" />

      <div v-if="isLoading" class="text-gray-600">{{ statusMessage }}</div>
      <div v-else>
        <div v-if="employeeType">
          <dl class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <dt class="col-span-1 text-gray-700 font-medium">{{ getDisplayName('code') }}</dt>
            <dd class="col-span-2 text-gray-900">{{ employeeType.code }}</dd>

            <dt class="col-span-1 text-gray-700 font-medium">{{ getDisplayName('name') }}</dt>
            <dd class="col-span-2 text-gray-900">{{ employeeType.name }}</dd>

            <dt class="col-span-1 text-gray-700 font-medium">{{ getDisplayName('category') }}</dt>
            <dd class="col-span-2 text-gray-900">{{ employeeType.category }}</dd>

            <dt class="col-span-1 text-gray-700 font-medium">{{ getDisplayName('description') }}</dt>
            <dd class="col-span-2 text-gray-900">{{ employeeType.description }}</dd>
          </dl>
          <div class="mt-6">
            <router-link :to="`/employee/employeeTypeEdit?code=${employeeType.code}`" class="text-blue-600 hover:underline mr-4"> Edit </router-link>
            <router-link to="/employee/employeeTypeList" class="text-blue-600 hover:underline"> Back to List </router-link>
          </div>
        </div>
        <p v-else class="text-red-500">{{ statusMessage || "データが見つかりませんでした。" }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { EmployeeTypeConfig } from '../config/employeeTypeConfig';
  //import { EmployeeType } from './types/employeeType';
  //import type { EmployeeType } from '@/components/types/employeeType';
  import type { EmployeeType } from '../types/employeeType';

  const apiBaseUrl = EmployeeTypeConfig.API_BASE_URL;
  const funcName = "明細";
  const title = `${EmployeeTypeConfig.BASE_TITLE}(${funcName})`;

  // リアクティブな状態の定義
  const employeeType = ref<EmployeeType | null>(null);
  const statusMessage = ref<string>("Loading...");
  const isLoading = ref<boolean>(true);

  // Vue Routerのフック
  const router = useRouter(); // navigateの代わり
  const route = useRoute();   // searchParamsの代わり

  // クエリパラメータから 'code' を取得
  // `route.query` は reactive なので、直接 `watch` の対象にできます
  const code = ref<string | null>(null);

  // getDisplayName ヘルパー関数
  const getDisplayName = (field: string): string => {
    switch (field) {
      case 'code': return 'コード';
      case 'name': return '名称';
      case 'category': return 'カテゴリ';
      case 'description': return '説明';
      default: return String(field);
    }
  };

  const fetchEmployeeTypeDetails = async (employeeCode: string | null) => {
    if (!employeeCode) {
      statusMessage.value = "エラー: 表示するコードが指定されていません。";
      isLoading.value = false;
      // 必要に応じてリダイレクト
      // router.push('/employeeTypes');
      return;
    }

    isLoading.value = true;
    statusMessage.value = "Loading..."; // ステータスメッセージをリセット

    try {
      const response = await fetch(`${apiBaseUrl}/${employeeCode}`);

      if (response.status === 404) {
        router.push('/notfound'); // /notfound ルートがあることを前提とします
        return; // 以降の実行を停止
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EmployeeType = await response.json(); // 型アサーション
      employeeType.value = data;
      statusMessage.value = ""; // 成功時にメッセージをクリア

    } catch (error: any) { // エラーの型を指定
      console.error("データ処理中にエラーが発生しました:", error);
      statusMessage.value = `データ処理中にエラーが発生しました: ${error.message}`;
      employeeType.value = null; // エラー時にemployeeTypeをクリア
    } finally {
      isLoading.value = false;
    }
  };

  // コンポーネントがマウントされた時、または `code` クエリパラメータが変更された時にデータをフェッチ
  onMounted(() => {
    code.value = route.query.code as string | null;
    fetchEmployeeTypeDetails(code.value);
  });

  // `route.query.code` の変更を監視し、変更があったらデータを再フェッチ
  watch(() => route.query.code, (newCode) => {
    code.value = newCode as string | null;
    fetchEmployeeTypeDetails(code.value);
  });
</script>

<style scoped>
    /* Tailwind CSS を使用しているため、通常は追加のスタイルは不要です。
     もし `min-h-screen`, `bg-gray-100`, `flex`, `flex-col`, `items-center`, `p-4`, `font-inter`,
     `bg-white`, `rounded-lg`, `shadow-md`, `w-full`, `max-w-4xl`, `text-2xl`, `font-bold`,
     `mb-4`, `text-gray-800`, `mb-4`, `text-gray-600`, `grid`, `grid-cols-1`, `sm:grid-cols-3`,
     `gap-4`, `col-span-1`, `text-gray-700`, `font-medium`, `col-span-2`, `text-gray-900`,
     `mt-6`, `text-blue-600`, `hover:underline`, `mr-4`, `text-red-500` といったクラスが
     Bootstrap など別のCSSフレームワーク由来である場合、Vueプロジェクトにそのフレームワークを
     インストールするか、同等のCSSを記述する必要があります。
  */
</style>
