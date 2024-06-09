export default defineNuxtPlugin(() => {
    if(process.client) {
        initDB().then(() => {
            console.log("database initialized")
        })
    }
})