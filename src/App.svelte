<script>
  import Table from "./common/table/Table4.svelte";

</script>

<div class="w-screen h-screen p-4">
  <Table />
</div>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    font-size: 13px;
  }

  button:hover {
    background-color: rgba(239, 239, 239, 0.5);
  }
</style>