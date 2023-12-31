<template>
  <router-view></router-view>

  <v-dialog v-model="showEmailDialog" width="auto">
    <v-card>
      <v-card-title>Email sent!</v-card-title>
      <v-card-text
        >An email has been sent to {{ personalInfoFormData.email }}. Please
        check your spam folder in case it hasn't appeared in your
        inbox</v-card-text
      >
      <br /><br />
      <v-card-actions>
        <v-btn @click="showEmailDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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

      <v-card-text>
        <v-alert
          v-if="stockLostValue"
          type="warning"
          :text="`Stock price for ${financialInfoFormData.stockName} has decreased it's price since the last working day's closing`"
        >
        </v-alert>
        <v-alert
          v-else
          type="success"
          :text="`Stock price for ${financialInfoFormData.stockName} has increased it's price since last working day's closing`"
        >
        </v-alert>
      </v-card-text>

      <br /><br />
      <v-card-actions>
        <v-btn @click="showDialog = false">Ok!</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          variant="flat"
          density="default"
          size="large"
          @click="emailResults"
          :loading="isEmailLoading"
          >Email me the results!</v-btn
        >
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
import {
  URL_SUBMIT,
  URL_MAIL,
  fileToBase64,
} from "@/components/constants/constants";

const axios = inject<AxiosStatic>("axios");

const financialInfoFormData = ref<FinancialInfo>({});
const personalInfoFormData = ref<PersonalInfo>({});

const financialInfoFormRef = ref();
const personalInfoFormRef = ref();

const isLoading = ref(false);
const isEmailLoading = ref(false);

const errors = ref<string[]>([]);

const showDialog = ref(false);
const showEmailDialog = ref(false);
const dialogApproved = ref(true);
const stockLostValue = ref(false);

let applicant = {};

const onFormSubmit = ref(async () => {
  isLoading.value = true;

  const license = personalInfoFormData.value.license
    ? await fileToBase64(personalInfoFormData.value.license[0])
    : undefined;

  applicant = {
    ...personalInfoFormData.value,
    license,
    finances: {
      ...financialInfoFormData.value,
      stock: [
        {
          name: financialInfoFormData.value.stockName,
          quantity: financialInfoFormData.value.stockQuantity,
        },
      ],
    },
  };

  axios
    ?.post(URL_SUBMIT, applicant)
    .then((res) => {
      console.log("response", res.data);
      errors.value = [];
      dialogApproved.value = res.data.approved;
      showDialog.value = true;

      const stockData = Object.values(res.data.stocks)[0] as Record<
        string,
        number | undefined
      >;

      stockLostValue.value =
        (stockData?.stockPrice ?? 0) < (stockData?.prevStockPrice ?? 0);
    })
    .catch((err) => {
      errors.value = err.response.data.message;
    })
    .finally(() => {
      personalInfoFormRef.value?.validate();
      financialInfoFormRef.value?.validate();
      isLoading.value = false;
    });
});

const emailResults = () => {
  isEmailLoading.value = true;
  axios
    ?.post(URL_MAIL, { applicant, approved: dialogApproved.value })
    .then(() => {})
    .finally(() => {
      isEmailLoading.value = false;
      showEmailDialog.value = true;
    });
};

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
provide("isLoading", isLoading);
</script>
