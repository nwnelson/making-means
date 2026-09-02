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
  <main class="admin-login-page">
    <section class="admin-login-card">
      <div class="admin-login-mark" aria-hidden="true">MM</div>
      <h1>Admin sign in</h1>
      <p>Sign in to manage Making Means content and orders.</p>
      <form class="admin-form" @submit.prevent="login">
        <div class="admin-field"><label for="admin-email">Email</label><input id="admin-email" v-model="email" name="email" type="text" autocomplete="email" ></div>
        <div class="admin-field"><label for="admin-password">Password</label><input id="admin-password" v-model="password" name="password" type="password" autocomplete="current-password" ></div>
        <div class="admin-form-actions"><Button type="submit" size="lg">Sign in</Button></div>
      </form>
    </section>
  </main>
</template>
