<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
      <h1 class="text-2xl font-bold mb-4 text-gray-800">{{ title }}</h1>

      <form @submit.prevent="handleSubmit" class="mb-6">
        <fieldset class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input type="text"
                 v-model="count"
                 class="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                 placeholder="表示する件数を入力して下さい。"
                 aria-label="表示する件数を入力" />
          <button type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
                  :disabled="isLoading">
            表示
          </button>
        </fieldset>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</p>
      </form>

      <p class="mb-4">
        <router-link to="/employee/employeeTypeCreate" class="text-blue-600 hover:underline">新規登録</router-link>
      </p>

      <div v-if="isLoading" class="text-gray-600">データロード中...</div>
      <div v-else>
        <div v-if="employeeTypes && employeeTypes.length > 0" class="overflow-x-auto rounded-lg">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コード</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">説明</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="employeeType in employeeTypes" :key="employeeType.code" class="hover:bg-gray-50">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ employeeType.code }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ employeeType.name }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ employeeType.category }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ employeeType.description }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">
                  <router-link :to="`/employee/employeeTypeEdit/${employeeType.code}`" class="text-indigo-600 hover:text-indigo-900 mr-2">編集</router-link> |
                  <router-link :to="`/employee/employeeTypeDetails?code=${employeeType.code}`" class="text-indigo-600 hover:text-indigo-900 mx-2">明細</router-link> |
                  <router-link :to="`/employee/employeeTypeDelete/${employeeType.code}`" class="text-indigo-600 hover:text-indigo-900 mx-2">削除</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <span v-else class="text-gray-600">データがありません</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { EmployeeTypeConfig } from '../config/employeeTypeConfig';
  //import { EmployeeType } from './types/employeeType';
  //import type { EmployeeType } from '@/components/types/employeeType';
  import type { EmployeeType } from '../types/employeeType';

  const apiBaseUrl = EmployeeTypeConfig.API_BASE_URL;
  const funcName = "一覧";
  const title = `${EmployeeTypeConfig.BASE_TITLE}(${funcName})`;

  // refの型引数を指定
  const employeeTypes = ref<EmployeeType[] | null>(null);
  const count = ref<string>('');
  const isLoading = ref<boolean>(true);
  const errorMessage = ref<string>('');

  const fetchEmployeeTypes = async (queryCount?: string) => { // queryCountをオプショナルなstring型に
    isLoading.value = true;
    errorMessage.value = '';
    let url = apiBaseUrl;
    if (queryCount && /^[1-9]\d*$/.test(queryCount)) {
      url = `${apiBaseUrl}?count=${queryCount}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // レスポンスデータをEmployeeType[]としてアサーション
      const data: EmployeeType[] = await response.json();
      employeeTypes.value = data;
    } catch (error) {
      console.error("API呼び出し中にエラーが発生しました:", error);
      errorMessage.value = "データの取得中にエラーが発生しました。";
      employeeTypes.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchEmployeeTypes();
  });

  const handleSubmit = () => {
    errorMessage.value = '';

    if (!count.value) {
      errorMessage.value = "件数を入力して下さい。";
      return;
    }
    if (!/^[1-9]\d*$/.test(count.value)) {
      errorMessage.value = "1以上の整数値を入力して下さい。";
      return;
    }

    fetchEmployeeTypes(count.value);
  };
</script>

<style scoped>
  /* 必要に応じてスタイルを追加できます。Tailwind CSSを使用しているため、通常は不要です。 */
</style>
