import { env } from './env'
import { app } from './app'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running in port 3000')
  })
  .catch((error) => {
    console.log(error)
  })
