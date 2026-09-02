<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "vue-sonner";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Admin Login",
  robots: "noindex, nofollow",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const { startLoading, stopLoading } = useLoading();
const email = ref("");
const password = ref("");

watch(
  user,
  (u) => {
    if (u?.app_metadata?.role === "admin") {
      navigateTo("/admin/dashboard");
    }
  },
  { immediate: true },
);

const login = async () => {
  console.log("logging in!");
  if (!email.value.trim() || !password.value.trim()) return;

  try {
    startLoading();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      console.log(error.message);
      toast.error(error.message);
      return;
    }

    email.value = "";
    password.value = "";

    // await navigateTo("/admin/dashboard");

    // if (user.value) {
    //   // already set
    //   await navigateTo("/admin/dashboard");
    // } else {
    // watch user for first login
    // }
  } catch (err) {
    console.error("Unexpected login error:", err);
    toast.error("Unable to log in. Please try again.");
  } finally {
    stopLoading();
  }
  // const { error } = await supabase.auth.signInWithPassword({
  //   email: email.value,
  //   password: password.value,
  // });

  // if (error) {
  //   console.log(error.message);
  //   return;
  // }

  email.value = "";
  password.value = "";

  // await navigateTo("/admin/dashboard"); // client side routing - maybe change to navigateTo?
};
</script>

<template>
  <div class="page centerContent">
    <div class="verticalContent">
      <h1>Login</h1>
      <form class="submissionForm" @submit.prevent="login">
        <input v-model="email" name="email" placeholder="Email" />
        <input
          type="password"
          v-model="password"
          name="password"
          placeholder="Password"
        />
        <Button type="submit" size="sm">Login</Button>
      </form>
    </div>
  </div>
</template>

<style></style>
