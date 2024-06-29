import type { NuxtLink } from "#build/components"; import type { NuxtLink } from
"#build/components"; import type { NuxtLink } from "#build/components"; import
type { NuxtLink } from "#build/components"; import ref from "vue"

<template>
  <header class="bg-[#2b2b2b] fixed lg:static top-0 left-0 w-full z-10 mx-auto">
    <div
      data-animation="header__wrapper"
      class="flex items-center justify-between w-full pt-5 pb-4 px-4 md:px-10 lg:pt-0 lg:pb-5"
    >
      <div
        data-animation="header__name"
        class="justify-self-start font-metana-outline uppercase text-3xl lg:text-8xl"
      >
        Astrologer
      </div>
      <div class="uppercase text-white text-3xl">/</div>
      <!-- <img @click="toggleNav" src="/burger/burger.svg" alt="" /> -->
      <div class="w-8 h-8">
        <Burger />
      </div>
    </div>
    <nav v-show="showNav">
      <NuxtLink @click="toggleNav" to="/"
        ><div>
          <h3>Home</h3>
          <p>News, blog articles, about app etc.</p>
        </div>
        <div>
          <p class="link">/</p>
          <p class="rand">lat: nn,m7, lon: -ii,12</p>
        </div>
      </NuxtLink>
      <NuxtLink @click="toggleNav" to="/persons"
        ><div>
          <h3>Charts</h3>
          <p>List of saved charts</p>
        </div>
        <div>
          <p class="link">/charts</p>
          <p class="rand">n = 3</p>
        </div></NuxtLink
      >
      <NuxtLink @click="toggleNav" to="/build-chart"
        ><div>
          <h3>Get positions</h3>
          <p>Get planets position for any moment</p>
        </div>
        <div>
          <p class="link">/position</p>
          <p class="rand">{{ today }}</p>
        </div></NuxtLink
      >
      <NuxtLink @click="toggleNav" to="/transits"
        ><div>
          <h3>Transits</h3>
          <p>Get current transits</p>
        </div>
        <div>
          <p class="link">/transits</p>
          <p class="rand">
            moon <span class="opposition">&#x2A3B;</span> venus
          </p>
        </div></NuxtLink
      >
    </nav>
  </header>
</template>

<script setup>
const showNav = ref(false);
const today = new Date().toISOString().substr(0, 10);

function toggleNav() {
  showNav.value = !showNav.value;
}
</script>

<style scoped>
header {
  padding: 10px 1rem 0 1rem;
  /* margin: 0 auto; */
  /* background-color: var(--background); */
  /* position: fixed; */
  /* width: 100%; */
  /* z-index: 10; */
  /* top: 0; */
  /* left: 0; */
}

.header__wrapper {
  height: 54px;
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  border-bottom: solid #fff 1px;
  padding-bottom: 10px;
}

.header__name {
  font-size: var(--size-lg);
  font-family: var(--font-display);
}

nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* margin-top: 64px; */
  position: absolute;
  top: 64px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 64px);
  padding: 1rem 1rem;
  background-color: rgba(15, 20, 26, 0.3);
  backdrop-filter: blur(8px);
}

nav a {
  text-decoration: none;
  font-size: var(--size-lg);
  font-weight: 200;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
}

nav a h3 {
  font-size: var(--size-md);
  padding: 0;
  text-align: left;
}

nav a p {
  font-size: var(--size-xxs);
  padding: 0;
  font-weight: 200;
  text-align: left;
}

.link {
  font-size: var(--size-md);
  font-weight: 200;
  text-align: right;
}
.rand {
  font-size: var(--size-xxs);
  font-weight: 200;
  text-align: right;
}

/* .opposition:before {
    content: url(/icons/stars.svg);
  } */
</style>
