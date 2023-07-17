<template>
  <v-container class="fill-height">
    <v-responsive class="align-center fill-height">
      <div class="d-flex flex-column align-center">
        <v-card width="500" title="Financial Information">
          <v-card-text>
            <div class="mb-4">Enter some financial information</div>

            <v-form ref="formRef">
              <v-text-field
                label="Salary paid every quarter"
                type="number"
                prefix="$"
                v-model="financialInfoForm.salaryPerQuarter"
                :rules="rules('salaryPerQuarter')"
              ></v-text-field>
              <v-text-field
                label="Total credit card debt"
                type="number"
                prefix="$"
                v-model="financialInfoForm.totalCreditCardDebt"
                :rules="rules('totalCreditCardDebt')"
              ></v-text-field>
              <v-text-field
                label="Current home loan debt"
                type="number"
                prefix="$"
                v-model="financialInfoForm.currentHomeLoanDebt"
                :rules="rules('currentHomeLoanDebt')"
              ></v-text-field>
              <v-text-field
                label="Current car loan debt"
                type="number"
                prefix="$"
                v-model="financialInfoForm.currentCarLoanDebt"
                :rules="rules('currentCarLoanDebt')"
              ></v-text-field>
              <v-text-field
                label="Total savings"
                type="number"
                prefix="$"
                v-model="financialInfoForm.totalSavings"
                :rules="rules('totalSavings')"
              ></v-text-field>
              <v-text-field
                label="1 stock you own"
                v-model="financialInfoForm.stockName"
                :rules="rules('stockName')"
              ></v-text-field>
              <v-text-field
                v-if="
                  financialInfoForm.stockName &&
                  financialInfoForm.stockName !== ''
                "
                :label="`Total number of ${financialInfoForm.stockName} stocks you own`"
                v-model="financialInfoForm.stockQuantity"
                :rules="rules('stockQuantity')"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <router-link to="/">
              <v-btn
                variant="text"
                color="blue-grey-lighten-2"
                density="default"
                size="large"
                prepend-icon="mdi-chevron-left"
              >
                Prev
              </v-btn>
            </router-link>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="green-accent-4"
              density="default"
              size="large"
              class="text-white"
              @click="onSubmit"
              :loading="isLoading"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Ref } from "vue";
import { inject } from "vue";
import { VTextField } from "vuetify/lib/components/index.mjs";
import { FinancialInfo } from "./constants/types";
import { CreateRule } from "./constants/rules";
import { onMounted } from "vue";

const formRef = inject<Ref>("financialInfoFormRef");

const financialInfoForm =
  inject<Ref<FinancialInfo>>("financialInfoFormData") ?? ref<FinancialInfo>({});

const onSubmit = inject<Ref<Function>>("onFormSubmit") ?? ref(() => {});

const rules = inject<CreateRule>("rules") ?? (() => undefined);
const isLoading = inject<Ref<boolean>>("isLoading");

onMounted(() => {
  formRef?.value?.validate();
});
</script>
