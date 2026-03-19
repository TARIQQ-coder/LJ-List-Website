import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const app = express()
app.use(cors())

const PORT = process.env.PORT ;

console.log("ENV PORT:", process.env.PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});