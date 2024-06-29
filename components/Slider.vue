<template>
  <div
    class="slider-container relative perspective-[1000px] h-[200px] overflow-hidden"
  >
    <div class="flex flex-col items-center h-full slides">
      <div
        class="absolute flex items-center justify-center w-full h-full slide backface-hidden transform-style-3d"
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ 'hidden-slide': currentSlide !== index }"
      >
        {{ slide }}
      </div>
    </div>
    <button class="absolute top-0 z-10" @click="changeSlide">Next Slide</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

const slides = ref(["1 slide", "2 slide", "3 slide"]);
const currentSlide = ref(0);

const changeSlide = () => {
  const nextSlide = (currentSlide.value + 1) % slides.value.length;

  gsap.to(`.slide:nth-child(${currentSlide.value + 1})`, {
    duration: 0.5,
    rotateX: -90,
    scale: 0.8,
    onComplete: () => {
      gsap.set(`.slide:nth-child(${currentSlide.value + 1})`, {
        visibility: "hidden",
      });
      currentSlide.value = nextSlide;
      gsap.set(`.slide:nth-child(${nextSlide + 1})`, { visibility: "visible" });
      gsap.fromTo(
        `.slide:nth-child(${nextSlide + 1})`,
        { rotateX: 90, scale: 0.8 },
        { duration: 0.5, rotateX: 0, scale: 1 }
      );
    },
  });
};

onMounted(() => {
  gsap.set(`.slide:nth-child(${currentSlide.value + 1})`, {
    rotateX: 0,
    scale: 1,
    visibility: "visible",
  });

  for (let i = 2; i <= slides.value.length; i++) {
    gsap.set(`.slide:nth-child(${i})`, {
      visibility: "hidden",
    });
  }
});
</script>

<style scoped>
.backface-hidden {
  backface-visibility: hidden;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
.hidden-slide {
  visibility: hidden;
}
</style>
