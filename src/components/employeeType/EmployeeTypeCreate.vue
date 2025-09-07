<template>
  <div>
    <title>{{ title }}</title>
    <h1>{{ title }}</h1>

    <hr />
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <div class="row">
      <div class="col-md-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="code" class="form-label">
              Code:
            </label>
            <input type="text"
                   id="code"
                   v-model="employeeType.code"
                   class="form-control" />
            <ValidationMessage v-if="!employeeType.code" message="Code is required." />
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">
              Name:
            </label>
            <input type="text"
                   id="name"
                   v-model="employeeType.name"
                   class="form-control" />
            <ValidationMessage v-if="!employeeType.name" message="Name is required." />
          </div>
          <div class="mb-3">
            <label for="category" class="form-label">
              Category:
            </label>
            <input type="text"
                   id="category"
                   v-model="employeeType.category"
                   class="form-control" />
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">
              Description:
            </label>
            <input type="text"
                   id="description"
                   v-model="employeeType.description"
                   class="form-control" />
          </div>
          <button type="submit" class="btn btn-primary" :disabled="isProcessing">
            {{ isProcessing ? 'Processing...' : 'Create' }}
          </button>
        </form>
      </div>
    </div>

    <div>
      <router-link to="/employee/employeeTypeList">Back to List</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, h } from 'vue';
  import { useRouter } from 'vue-router';
  import { EmployeeTypeConfig } from '../config/employeeTypeConfig';
  //import { EmployeeType } from './types/employeeType';
  //import type { EmployeeType } from '@/components/types/employeeType';
  import type { EmployeeType } from '../types/employeeType';

  // ValidationMessage コンポーネント
  // Reactの例ではインラインで定義されていますが、Vueでは別のSFCとして定義するのが一般的です。
  // ただし、ここではシンプルにするため、このファイル内に直接定義します。
  // より大規模なアプリでは、これを src/components/ValidationMessage.vue として分離してください。
  interface ValidationMessageProps {
    message: string;
  }
  const ValidationMessage = (props: ValidationMessageProps) => {
    return h('div', { class: 'text-danger' }, props.message);
  };
  // ☝️ 上記は functional component の簡単な例です。
  // 通常は src/components/ValidationMessage.vue のように別ファイルで作成します。

  const apiBaseUrl = EmployeeTypeConfig.API_BASE_URL;
  const funcName = "新規登録";
  const title = `${EmployeeTypeConfig.BASE_TITLE}(${funcName})`;

  // reactiveを使ってオブジェクトの状態を宣言
  const employeeType = reactive<EmployeeType>({
    code: '',
    name: '',
    category: '',
    description: '',
  });

  const isProcessing = ref<boolean>(false);
  const errorMessage = ref<string>('');
  const router = useRouter(); // ReactのuseNavigateの代わりにuseRouterを使用

  const validateForm = (): boolean => {
    let isValid = true;
    let newErrorMessage = '';

    if (!employeeType.code) {
      newErrorMessage += 'Code is required. ';
      isValid = false;
    }
    if (!employeeType.name) {
      newErrorMessage += 'Name is required. ';
      isValid = false;
    }
    // 他のフィールドに対するバリデーションルールを追加

    errorMessage.value = newErrorMessage;
    return isValid;
  };

  const handleSubmit = async () => {
    if (isProcessing.value) return;

    if (!validateForm()) {
      return;
    }

    isProcessing.value = true;
    errorMessage.value = ''; // 以前のエラーをクリア

    try {
      const response = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeType),
      });

      if (response.ok) {
        router.push('/employee/employeeTypeList'); // 成功時にリストページへリダイレクト
      } else {
        const errorData = await response.json();
        errorMessage.value = `更新に失敗しました。ステータス: ${response.status}. エラー: ${errorData.message || '不明なエラー'}`;
      }
    } catch (error: any) { // エラーの型を指定
      errorMessage.value = `データ処理中にエラーが発生しました: ${error.message}`;
    } finally {
      isProcessing.value = false;
    }
  };
</script>

<style scoped>
    /* BootstrapライクなスタイルがReactの元のコードで使用されています。
     VueプロジェクトにBootstrapが導入されていない場合、これらのクラスは機能しません。
     Tailwind CSSなど他のフレームワークを使用している場合は、それに合わせてクラス名を調整してください。
     例:
     .text-danger { color: #dc3545; }
     .alert { padding: 1rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: 0.25rem; }
     .alert-danger { color: #842029; background-color: #f8d7da; border-color: #f5c2c7; }
     .row { display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; }
     .col-md-4 { flex: 0 0 auto; width: 33.333333%; }
     .mb-3 { margin-bottom: 1rem; }
     .form-label { margin-bottom: 0.5rem; }
     .form-control { display: block; width: 100%; padding: 0.375rem 0.75rem; font-size: 1rem; line-height: 1.5; color: #495057; background-color: #fff; background-clip: padding-box; border: 1px solid #ced4da; border-radius: 0.25rem; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
     .btn { display: inline-block; font-weight: 400; color: #212529; text-align: center; vertical-align: middle; cursor: pointer; user-select: none; background-color: transparent; border: 1px solid transparent; padding: 0.375rem 0.75rem; font-size: 1rem; line-height: 1.5; border-radius: 0.25rem; transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
     .btn-primary { color: #fff; background-color: #0d6efd; border-color: #0d6efd; }
     .btn-primary:hover { color: #fff; background-color: #0b5ed7; border-color: #0a58ca; }
     .btn:disabled { opacity: 0.65; }
  */
</style>
