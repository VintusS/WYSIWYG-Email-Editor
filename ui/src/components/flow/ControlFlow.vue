<script lang="ts" setup>
import { ref } from 'vue'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, type Node, type Edge, Position} from '@vue-flow/core'
import CustomNode from './nodes/CustomNode.vue'
import CustomEdge from './edges/CustomEdge.vue'


interface Controller {
  id: string;
  name: string;
  children: Controller[];
}

const data: Controller[] = hierarchyJSON;
const { onConnect, addEdges } = useVueFlow();

let nodesArray: Node[] = [];
let edgesArray: Edge[] = [];

const counter = ref(0);

function addControllerToFlow(
  controller: Controller,
  parentPosition: { x: number; y: number },
  level: number,
  previousParentId?: string
): number {
  const node: Node = {
    id: controller.id,
    position: { x: parentPosition.x, y: parentPosition.y + 150 }, // Adjust y position for vertical depth
    data: { label: controller.name },
    width: "auto",
  };
  nodesArray.push(node);

  let maxRightPosition = parentPosition.x;

  // If there's a previous parent at the same level, connect them horizontally
  if (previousParentId) {
    const parentEdge: Edge = {
      id: `${previousParentId}-${controller.id}`,
      source: previousParentId,
      sourcePosition: Position.Left,
      target: controller.id,
      targetPosition: Position.Right,
      type: 'custom',
    };
    edgesArray.push(parentEdge);
  }

  // Process the children of the current controller
  if (controller.children && controller.children.length > 0) {
    const horizontalSpacing = 300;
    const totalWidth = (controller.children.length - 1) * horizontalSpacing;

    for (let i = 0; i < controller.children.length; i++) {
      const child = controller.children[i];

      // Adjust child's position on the x-axis based on its index
      const childPosition = {
        x: parentPosition.x - totalWidth / 2 + i * horizontalSpacing,
        y: parentPosition.y + 150 // Vertical child layout
      };

      const edge: Edge = {
        id: `${controller.id}-${child.id}`,
        source: controller.id,
        target: child.id,
        type: 'custom',
      };
      edgesArray.push(edge);

      // Recursively add child controllers and get the rightmost position of the child
      const rightmostChildPosition = addControllerToFlow(child, childPosition, level + 1);

      // Update maxRightPosition with the rightmost child's position
      if (rightmostChildPosition > maxRightPosition) {
        maxRightPosition = rightmostChildPosition;
      }
    }
  }

  // Return the max rightmost position
  return maxRightPosition;
}

// Initialize the nodes and edges by adding all root controllers
let previousRightmostPosition = 0;

for (let i = 0; i < data.length; i++) {
  const previousParentId = i > 0 ? data[i - 1].id : undefined;
  
  // Calculate the starting position for the parent
  const parentPosition = { 
    x: previousRightmostPosition + 400, // Add spacing between parents based on the rightmost position of the previous parent
    y: 100 
  };
  
  // Add the parent and calculate the rightmost position of its children
  const rightmostPosition = addControllerToFlow(data[i], parentPosition, 0, previousParentId);
  
  // Update the previous rightmost position for the next parent
  previousRightmostPosition = rightmostPosition;
}

const nodes = ref<Node[]>(nodesArray);
const edges = ref<Edge[]>(edgesArray);

onConnect((params) => {
  addEdges([params]);
});
</script>

<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    fit-view-on-init
    class="vue-flow-basic-example"
    :default-zoom="1.5"
    :min-zoom="0.2"
    :max-zoom="4"
  >
    <Background pattern-color="#aaa" :gap="8" />
    <MiniMap />
    <Controls />
    
    <template #node-custom="nodeProps">
      <CustomNode v-bind="nodeProps" />
    </template>
    
    <template #edge-custom="edgeProps">
      <CustomEdge v-bind="edgeProps" />
    </template>
  </VueFlow>
</template>