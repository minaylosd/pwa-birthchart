<template>
  <div
    class="bg-[#2b2b2b] lg:py-5 flex flex-col gap-0 min-h-[100vh] h-full w-full 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto"
  >
    <AppHeader />
    <main class="px-0 md:px-10 mt-[82px] md:mt-0 h-full flex-grow">
      <div
        class="md:rounded-tl-[45px] md:rounded-tr-[15px] md:rounded-br-[45px] md:rounded-bl-[30px] rounded-tl-[30px] rounded-tr-[30px] rounded-br-[0] rounded-bl-[0] bg-[#9B89FF] h-full flex flex-grow flex-col sm:px-4 md:px-10 md:py-10 md:mt-0 shadow-xl lg:shadow-none"
      >
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>
