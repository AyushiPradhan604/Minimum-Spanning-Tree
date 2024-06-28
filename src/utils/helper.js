// Prim's Minimum Spanning Tree (MST) Algorithm
function primMST(numVertices, edgesList) {
  // Initialize variables
  let visited = new Array(numVertices).fill(false);
  let parent = new Array(numVertices).fill(-1);
  let key = new Array(numVertices).fill(Number.MAX_SAFE_INTEGER);

  // Start from vertex 0
  key[0] = 0;
  let mstEdges = [];

  // Construct MST with (numVertices - 1) edges
  for (let count = 0; count < numVertices - 1; count++) {
    // Find the vertex with the minimum key value from the set of vertices not yet included in MST
    let minKey = Number.MAX_SAFE_INTEGER;
    let minIndex = -1;

    for (let v = 0; v < numVertices; v++) {
      if (visited[v] === false && key[v] < minKey) {
        minKey = key[v];
        minIndex = v;
      }
    }

    // Add the picked vertex to the MST
    visited[minIndex] = true;

    // Update key and parent arrays of adjacent vertices
    for (let edge of edgesList) {
      let u = edge[0];
      let v = edge[1];
      let weight = edge[2];

      if (u === minIndex && visited[v] === false && weight < key[v]) {
        parent[v] = minIndex;
        key[v] = weight;
      }
      if (v === minIndex && visited[u] === false && weight < key[u]) {
        parent[u] = minIndex;
        key[u] = weight;
      }
    }
  }

  // Construct the MST edges list based on parent array
  for (let i = 1; i < numVertices; i++) {
    mstEdges.push([parent[i], i, key[i]]);
  }
  console.log(mstEdges);
  return mstEdges;
}

export { primMST };
