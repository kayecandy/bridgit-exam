<template>
  <router-view></router-view>
  <v-dialog v-model="showDialog" width="auto">
    <v-card>
      <v-card-title v-if="dialogApproved">Congratulations!</v-card-title>
      <v-card-title v-else>Sorry!</v-card-title>
      <v-card-text v-if="dialogApproved"
        >Your application has been approved</v-card-text
      >
      <v-card-text v-else
        >You application has been rejected. Please try again with different
        parameters.</v-card-text
      >
      <v-card-actions>
        <v-btn @click="showDialog = false">Ok!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { inject } from "vue";
import { ref } from "vue";
import { provide } from "vue";
import { AxiosStatic } from "axios";
import { FinancialInfo, PersonalInfo } from "@/components/constants/types";
import { CreateRule, ERRORS } from "@/components/constants/rules";
import { URL_SUBMIT } from "@/components/constants/constants";

const axios = inject<AxiosStatic>("axios");

const financialInfoFormData = ref<FinancialInfo>({});
const personalInfoFormData = ref<PersonalInfo>({});

const financialInfoFormRef = ref();
const personalInfoFormRef = ref();

const errors = ref<string[]>([]);

const showDialog = ref(false);
const dialogApproved = ref(true);

const onFormSubmit = ref(() => {
  axios
    ?.post(URL_SUBMIT, {
      ...personalInfoFormData.value,
      license: "test",
      finances: {
        ...financialInfoFormData.value,
        stock: [
          {
            name: financialInfoFormData.value.stockName,
            quantity: financialInfoFormData.value.stockQuantity,
          },
        ],
      },
    })
    .then((res) => {
      console.log("response", res.data);
      errors.value = [];
      dialogApproved.value = res.data.approved;
      showDialog.value = true;
    })
    .catch((err) => {
      errors.value = err.response.data.message;
    })
    .finally(() => {
      personalInfoFormRef.value?.validate();
      financialInfoFormRef.value?.validate();
    });
});

const rules: CreateRule = (key) => {
  const keyErrors = ERRORS[key];

  return [
    () => {
      const keyError = keyErrors.filter(
        (error) => errors.value.indexOf(error.code) !== -1
      );

      if (keyError.length) {
        return keyError[0].message;
      }

      return true;
    },
  ];
};

provide("financialInfoFormData", financialInfoFormData);
provide("personalInfoFormData", personalInfoFormData);
provide("financialInfoFormRef", financialInfoFormRef);
provide("personalInfoFormRef", personalInfoFormRef);
provide("onFormSubmit", onFormSubmit);
provide("rules", rules);
</script>
