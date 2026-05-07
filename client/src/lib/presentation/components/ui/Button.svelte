<script lang="ts">
  import { Button as BitsButton } from "bits-ui";
  // 允许通过 props 接收 class 并进行合并
  let { children, class: className, ...props } = $props(); 
</script>

<BitsButton.Root {...props} class="bg-orange-600 text-white font-bold transition-all hover:bg-orange-500 active:scale-[0.98] disabled:opacity-50 {className ?? ''}">
  {@render children()}
</BitsButton.Root>
