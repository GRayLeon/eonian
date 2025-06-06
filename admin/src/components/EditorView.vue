<script setup>
  import { useEditorStore } from '@/stores/editor'
	import { storeToRefs } from 'pinia'

  const editorStore = useEditorStore()
	const { editorContent } = storeToRefs(editorStore)

</script>

<template>
</template>

<style scoped>
</style>
