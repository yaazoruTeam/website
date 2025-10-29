// Error interface that extends Error with HTTP status property
// Used for throwing errors with specific HTTP status codes
interface Model extends Error {
    status: number;
}

export { Model }