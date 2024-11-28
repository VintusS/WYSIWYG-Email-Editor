<script lang="ts" setup>
import { NodeProps } from '@vue-flow/core';
import { Position } from '@vue-flow/core';


interface CustomData {
    label: string;
}


interface CustomEvents {
    onClick: (event: MouseEvent, node: NodeProps<CustomData, CustomEvents>) => void;
}


type CustomNodeTypes = "controller" | "trigger" | "action";

const props = defineProps<NodeProps<CustomData, CustomEvents>>();
</script>
<template>
    <div>
      <Handle type="target" :position="Position.Top" />
      <div>{{ props.data.label }}</div>
      <Handle type="source" :position="Position.Bottom" />
    </div>
  </template>
  