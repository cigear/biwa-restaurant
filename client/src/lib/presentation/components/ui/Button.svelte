<script lang="ts">
  import { Button as BitsButton } from "bits-ui";
  let { children, ...props } = $props(); // Svelte 5 Runes 语法
</script>

<BitsButton.Root {...props} class="bg-primary text-white ...">
  {@render children()}
</BitsButton.Root>

