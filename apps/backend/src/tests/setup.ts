import mongoose from 'mongoose'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

let replset: MongoMemoryReplSet

beforeAll(async () => {
  replset = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
  const uri = replset.getUri()
  await mongoose.connect(uri)
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await replset.stop()
})
