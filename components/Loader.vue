<template>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="star-a"
      d="M3 8.9292L3.42426 11.5049L6 11.9292L3.42426 12.3535L3 14.9292L2.57574 12.3535L0 11.9292L2.57574 11.5049L3 8.9292Z"
      fill="white"
    />
    <path
      class="star-b"
      d="M4.2168 4.97705L4.57035 7.1235L6.7168 7.47705L4.57035 7.8306L4.2168 9.97705L3.86324 7.8306L1.7168 7.47705L3.86324 7.1235L4.2168 4.97705Z"
      fill="white"
    />
    <path
      class="star-c"
      d="M7.52539 2.18896L7.80823 3.90612L9.52539 4.18896L7.80823 4.47181L7.52539 6.18896L7.24255 4.47181L5.52539 4.18896L7.24255 3.90612L7.52539 2.18896Z"
      fill="white"
    />
    <path
      class="star-d"
      d="M10.5 1.5L10.7121 2.78787L12 3L10.7121 3.21213L10.5 4.5L10.2879 3.21213L9 3L10.2879 2.78787L10.5 1.5Z"
      fill="white"
    />
  </svg>
</template>

<script>
export default {
  name: "Loader",
};
</script>

<style scoped>
.star-a {
  transform-origin: center center;
  animation: spin 2s cubic-bezier(0.54, 0.1, 0.26, 0.83) infinite;
}

.star-b {
  transform-origin: center center;
  animation: spin 2s cubic-bezier(0.54, 0.1, 0.26, 0.83) infinite;
  animation-delay: 40ms;
}

.star-c {
  transform-origin: center center;
  animation: spin 2s cubic-bezier(0.54, 0.1, 0.26, 0.83) infinite;
  animation-delay: 80ms;
}

.star-d {
  transform-origin: center center;
  animation: spin 2s cubic-bezier(0.54, 0.1, 0.26, 0.83) infinite;
  animation-delay: 120ms;
}

@keyframes spin {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
