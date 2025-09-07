<template>
  <div>
    <title>{{ title }}</title>
    <h1>{{ title }}</h1>
    <hr />

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="employeeType === null">
      <p><em>{{ statusMessage }}</em></p>
    </div>
    <div v-else class="row">
      <div class="col-md-4">
        <form @submit.prevent="handleUpdateEmployeeType">
          <div class="mb-3">
            <label for="code" class="form-label">
              Code:
            </label>
            <input type="text"
                   id="code"
                   v-model="employeeType.code"
                   disabled
                   class="form-control" />
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
          <button type="submit" :disabled="isProcessing" class="btn btn-primary">
            {{ isProcessing ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" :disabled="isProcessing" @click="handleCancel" class="btn btn-secondary ms-2">
            キャンセル
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
  import { ref, watch, onMounted, h } from 'vue'; // h をインポート
  import { useRoute, useRouter } from 'vue-router';
  import { EmployeeTypeConfig } from '../config/employeeTypeConfig';
  //import { EmployeeType } from './types/employeeType';
  //import type { EmployeeType } from '@/components/types/employeeType';
  import type { EmployeeType } from '../types/employeeType';

  // ValidationMessage コンポーネント
  // 前の例と同様に、ここでは functional component として定義します。
  // 実際には src/components/ValidationMessage.vue などで分離することを推奨します。
  interface ValidationMessageProps {
    message?: string; // `message` がない場合もあるため、オプショナルに
  }
  const ValidationMessage = (props: ValidationMessageProps) => {
    if (!props.message) return null;
    return h('div', { class: 'text-danger' }, props.message);
  };

  const apiBaseUrl = EmployeeTypeConfig.API_BASE_URL;
  const funcName = "編集";
  const title = `${EmployeeTypeConfig.BASE_TITLE}(${funcName})`;

  // リアクティブな状態の定義
  const employeeType = ref<EmployeeType | null>(null);
  const isProcessing = ref<boolean>(false);
  const statusMessage = ref<string>('Loading...');
  const errorMessage = ref<string>('');

  // Vue Routerのフック
  const route = useRoute();   // useParamsの代わり
  const router = useRouter(); // useNavigateの代わり

  // URLパスパラメータから 'code' を取得
  const code = ref<string | null>(null);

  const fetchEmployeeType = async (employeeCode: string | null) => {
    if (!employeeCode) {
      statusMessage.value = "編集する従業員区分のコードが指定されていません。";
      return;
    }

    try {
      // BlazorのTask.Delayに合わせた遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch(`${apiBaseUrl}/${employeeCode}`);
      if (response.ok) {
        const data: EmployeeType = await response.json(); // 型アサーション
        employeeType.value = data;
      } else if (response.status === 404) {
        router.push('/notfound'); // /notfound ルートがあることを前提とします
      } else {
        const errorText = await response.text();
        statusMessage.value = `データの読み込みに失敗しました。ステータス: ${response.status}. ${errorText}`;
      }
    } catch (error: any) {
      statusMessage.value = `データの取得中にエラーが発生しました: ${error.message}`;
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    let newErrorMessage = '';

    // employeeType が null の場合はバリデーションしない
    if (!employeeType.value) {
      newErrorMessage += 'データを読み込んでから編集してください。';
      isValid = false;
    } else if (!employeeType.value.name) { // employeeType.value が存在する場合のみアクセス
      newErrorMessage += 'Name is required. ';
      isValid = false;
    }
    // 他のフィールドに対するバリデーションルールを追加

    errorMessage.value = newErrorMessage;
    return isValid;
  };

  const handleUpdateEmployeeType = async () => {
    if (isProcessing.value) return;

    if (!validateForm()) {
      return;
    }

    isProcessing.value = true;
    errorMessage.value = ''; // 以前のAPIエラーをクリア

    // BlazorのTask.Delayに合わせた遅延をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await fetch(`${apiBaseUrl}/${employeeType.value!.code}`, { // !でnullチェックをスキップ (validateFormで確認済み)
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeType.value),
      });

      if (response.ok) {
        router.push('/employeeTypeList'); // 成功時にリストページへリダイレクト
      } else {
        const errorData = await response.json().catch(() => ({ message: '不明なエラー' }));
        errorMessage.value = `更新に失敗しました。ステータス: ${response.status}. エラー: ${errorData.message || response.statusText}`;
      }
    } catch (error: any) {
      errorMessage.value = `データ処理中にエラーが発生しました: ${error.message}`;
    } finally {
      isProcessing.value = false;
    }
  };

  const handleCancel = () => {
    if (isProcessing.value) return;
    router.push('/employeeTypeList'); // リストページに戻る
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
