<template>
   <div class="spinner">
      <h1>loading....</h1>
   </div>
</template>

<script>
export default {
  name: "callback",
  props: ["auth"],
  data() {
    this.auth.handleAuthentication();
    return {};
  },
};
</script>

<style>
.spinner {
  position: absolute;
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
