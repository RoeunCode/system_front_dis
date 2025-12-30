<template>
  <div class="mt-2 d-flex abc">
    <span
      class="d-flex align-center justify-center flex-wrap name customKhmerMoul text-green-darken-4"
    >
      <!-- &copy; {{ new Date().getFullYear() }} -->
      <!-- <VIcon icon="mdi-heart" color="error" size="1.25rem" class="mx-1" /> -->
      <!-- <a
        href="https://www.facebook.com/teang.tela/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-green-darken-4 ms-1 customKhmerMoul name"
      >
        ICT Department ICONIC
      </a> -->

      <p
        class="ml-4 text-orange font-weight-bold bg-orange-lighten-5 border rounded-xl px-3 py-0"
      >
        V 2.0.7
      </p>
    </span>
  </div>
</template>

<style>
.abc {
  position: fixed;
  z-index: 999;
  bottom: 10px;
  left: 240px;
  font-size: 15px;
}

.name {
  font-weight: 610;
  text-decoration: none;
}

@media (max-width: 768px) {
  .abc {
    left: 0;
    right: 0;
    bottom: 10px;
    justify-content: center;
    font-size: 13px;
    padding: 0 10px;
  }

  .abc span {
    flex-direction: row; /* keep row layout */
    flex-wrap: wrap; /* allow wrapping if too long */
    gap: 6px; /* reduce spacing */
    text-align: center;
    justify-content: center;
  }

  .abc a {
    font-size: 13px; /* smaller link text */
  }

  .abc p {
    font-size: 12px; /* smaller version text */
    margin-left: 0; /* remove big margin */
  }
}
</style>
