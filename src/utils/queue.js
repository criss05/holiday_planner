const LOCAL_QUEUE_KEY = "holidayQueue";


export const getQueue = () => {
  return JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || "[]");
};

export const saveQueue = (queue) => {
  localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(queue));
};

export const queueOperation = (operation) => {
  const queue = getQueue();
  queue.push(operation);
  saveQueue(queue);
};

export const processQueue = async () => {
    const queue = getQueue();
    const newQueue = [];
  
    for (const op of queue) {
      try {
        const response = await fetch(op.url, {
          method: op.method,
          headers: { "Content-Type": "application/json" },
          body: op.body ? JSON.stringify(op.body) : undefined,
        });
  
        if (!response.ok) {
          throw new Error(`Failed to execute ${op.method} on ${op.url}`);
        }
      } catch (error) {
        console.warn(`Failed to sync operation: ${JSON.stringify(op)}, Error:`, error);
        localStorage.clear();
        return;
      }
    }
  
    saveQueue(newQueue);
  };
