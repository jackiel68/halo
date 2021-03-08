// Generates a redux action with type only (no payload)
export const emptyActionGenerator = (type) => () => ({ type });

// Generates a redux action with type and payload
export const payloadActionGenerator = (type) => (payload) => ({ type, payload });
