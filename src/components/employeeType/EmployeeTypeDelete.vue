<template>
  <div>
    <title>{{ title }}</title>
    <h1>{{ title }}</h1>

    <div>
      <div v-if="isLoading">
        <p><em>Loading...</em></p>
      </div>
      <div v-else-if="employeeType === null">
        <p>{{ errorMessage || 'データを読み込めませんでした。' }}</p>
      </div>
      <div v-else>
        <p>本当にこの情報を削除しますか？</p>
        <hr />
        <dl class="row">
          <dt class="col-sm-2">Code</dt>
          <dd class="col-sm-10">{{ employeeType.code }}</dd>
        </dl>
        <dl class="row">
          <dt class="col-sm-2">Name</dt>
          <dd class="col-sm-10">{{ employeeType.name }}</dd>
        </dl>
        <dl class="row">
          <dt class="col-sm-2">Category</dt>
          <dd class="col-sm-10">{{ employeeType.category }}</dd>
        </dl>
        <dl class="row">
          <dt class="col-sm-2">Description</dt>
          <dd class="col-sm-10">{{ employeeType.description }}</dd>
        </dl>

        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <div v-if="isProcessing" class="alert alert-info" role="status">
          <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          削除中...
        </div>

        <button @click="handleDeleteEmployeeType"
                class="btn btn-danger"
                :disabled="isProcessing">
          削除
        </button>
        <router-link to="/employee/employeeTypeList" class="btn btn-secondary ms-2">
          戻る
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { EmployeeTypeConfig } from '../config/employeeTypeConfig';
  //import { EmployeeType } from './types/employeeType';
  //import type { EmployeeType } from '@/components/types/employeeType';
  import type { EmployeeType } from '../types/employeeType';

  const apiBaseUrl = EmployeeTypeConfig.API_BASE_URL;
  const funcName = "削除";
  const title = `${EmployeeTypeConfig.BASE_TITLE}(${funcName})`;

  // リアクティブな状態の定義
  const employeeType = ref<EmployeeType | null>(null);
  const isProcessing = ref<boolean>(false);
  const isLoading = ref<boolean>(true);
  const errorMessage = ref<string>('');

  // Vue Routerのフック
  const route = useRoute();   // useParamsの代わり
  const router = useRouter(); // useNavigateの代わり

  // URLパスパラメータから 'code' を取得
  const code = ref<string | null>(null);

  const fetchEmployeeType = async (employeeCode: string | null) => {
    if (!employeeCode) {
      errorMessage.value = "削除する従業員区分のコードが指定されていません。";
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    errorMessage.value = ''; // エラーメッセージをクリア

    try {
      // BlazorのTask.Delayに合わせた遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch(`${apiBaseUrl}/${employeeCode}`);
      if (response.ok) {
        const data: EmployeeType = await response.json(); // 型アサーション
        employeeType.value = data;
      } else if (response.status === 404) {
        errorMessage.value = `コード '${employeeCode}' に該当する情報が見つかりませんでした。`;
        // 必要に応じて、navigate('/notfound'); のようにリダイレクトすることも可能
      } else {
        const errorText = await response.text();
        errorMessage.value = `データの読み込みに失敗しました。ステータス: ${response.status}. ${errorText}`;
      }
    } catch (error: any) {
      errorMessage.value = `データの取得中にエラーが発生しました: ${error.message}`;
    } finally {
      isLoading.value = false;
    }
  };

  const handleDeleteEmployeeType = async () => {
    if (isProcessing.value || employeeType.value === null) return;

    // ユーザーに確認を求める (推奨)
    if (!window.confirm(`本当に従業員区分「${employeeType.value.name}」を削除しますか？`)) {
      return;
    }

    isProcessing.value = true;
    errorMessage.value = ''; // 以前のエラーをクリア

    // BlazorのTask.Delayに合わせた遅延をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await fetch(`${apiBaseUrl}/${employeeType.value.code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/employee/employeeTypeList'); // 成功時にリストページへリダイレクト
      } else {
        const errorData = await response.json().catch(() => ({ message: '不明なエラー' }));
        errorMessage.value = `削除に失敗しました。ステータスコード: ${response.status}. エラー: ${errorData.message || response.statusText}`;
      }
    } catch (error: any) {
      errorMessage.value = `削除中にエラーが発生しました: ${error.message}`;
      console.error('Exception during delete:', error);
    } finally {
      isProcessing.value = false;
    }
  };

  // コンポーネントがマウントされた時、または `code` パスパラメータが変更された時にデータをフェッチ
  onMounted(() => {
    code.value = route.params.code as string | null;
    fetchEmployeeType(code.value);
  });

  // `route.params.code` の変更を監視し、変更があったらデータを再フェッチ
  watch(() => route.params.code, (newCode) => {
    code.value = newCode as string | null;
    fetchEmployeeType(code.value);
  });
</script>

<style scoped>
    /* Bootstrapのようなクラス名（row, col-sm-2, col-sm-10, alert, btn, ms-2など）が使用されています。
     VueプロジェクトにBootstrapが導入されていない場合、これらのクラスは機能しません。
     必要に応じて、同等のCSSを記述するか、利用しているCSSフレームワークのクラスに置き換えてください。

     例:
     .row { display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; }
     .col-sm-2 { flex: 0 0 auto; width: 16.666667%; }
     .col-sm-10 { flex: 0 0 auto; width: 83.333333%; }
     .alert { padding: 1rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: 0.25rem; }
     .alert-danger { color: #842029; background-color: #f8d7da; border-color: #f5c2c7; }
     .alert-info { color: #055160; background-color: #cff4fc; border-color: #b6effb; }
     .spinner-border { display: inline-block; width: 1rem; height: 1rem; vertical-align: -0.125em; border: 0.125em solid currentColor; border-right-color: transparent; border-radius: 50%; animation: .75s linear infinite spinner-border; }
     @keyframes spinner-border { to { transform: rotate(360deg); } }
     .btn { display: inline-block; font-weight: 400; color: #212529; text-align: center; vertical-align: middle; cursor: pointer; user-select: none; background-color: transparent; border: 1px solid transparent; padding: 0.375rem 0.75rem; font-size: 1rem; line-height: 1.5; border-radius: 0.25rem; transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
     .btn-danger { color: #fff; background-color: #dc3545; border-color: #dc3545; }
     .btn-danger:hover { color: #fff; background-color: #bb2d3b; border-color: #bb2d3b; }
     .btn-secondary { color: #fff; background-color: #6c757d; border-color: #6c757d; }
     .btn-secondary:hover { color: #fff; background-color: #5c636a; border-color: #565e64; }
     .ms-2 { margin-left: 0.5rem !important; }
  */
</style>
