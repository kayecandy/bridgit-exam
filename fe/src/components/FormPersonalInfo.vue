<template>
  <v-container class="fill-height">
    <v-responsive class="align-center fill-height">
      <div class="d-flex flex-column align-center">
        <v-card width="500" title="Personal Information">
          <v-card-text>
            <div class="mb-4">Enter your personal information</div>
            <v-form ref="formRef">
              <v-text-field
                label="First Name"
                v-model="personalInfoForm.firstName"
                :rules="rules('firstName')"
              ></v-text-field>
              <v-text-field
                label="Last Name"
                v-model="personalInfoForm.lastName"
                :rules="rules('lastName')"
              ></v-text-field>
              <v-text-field
                label="Location Name"
                v-model="personalInfoForm.location"
                :rules="rules('location')"
              ></v-text-field>
              <v-text-field
                label="Date of Birth"
                type="date"
                v-model="personalInfoForm.dateOfBirth"
                :rules="rules('dateOfBirth')"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <router-link to="financial-info">
              <v-btn
                variant="text"
                color="green-accent-4"
                density="default"
                size="large"
                append-icon="mdi-chevron-right"
              >
                Next
              </v-btn>
            </router-link>
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
import { PersonalInfo } from "./constants/types";
import { CreateRule } from "./constants/rules";
import { onMounted } from "vue";

const formRef = inject<Ref>("personalInfoFormRef");

const personalInfoForm =
  inject<Ref<PersonalInfo>>("personalInfoFormData") ?? ref<PersonalInfo>({});

const rules = inject<CreateRule>("rules") ?? (() => undefined);

onMounted(() => {
  formRef?.value?.validate();
});
</script>
