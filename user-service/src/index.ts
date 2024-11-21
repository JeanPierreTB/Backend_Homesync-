import express from 'express';
import { AppDataSource } from './database';
import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
import router_cliente from './routers/Cliente_router';
import router_proveedor from './routers/Proveedor_router';
import router_administrador from './routers/Administrador_router';


dotenv.config();

const app = express();
const port = 3001;

app.use(express.json()); 

app.use("/cliente",router_cliente);
app.use('/proveedor',router_proveedor);
app.use('/administrador',router_administrador);

AppDataSource.initialize()
  .then(() => {
    console.log('DataSource has been initialized!');
  })
  .catch((err: Error) => {  
    console.error('Error during DataSource initialization', err);
  });

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});
const producer = kafka.producer();

producer.connect()
  .then(() => {
    console.log('Kafka producer connected');
  })
  .catch((err: Error) => { 
    console.error('Error connecting to Kafka:', err);
  });


/*
app.post('/create-user', async (req, res) => {
  const { usuario, correo,contrasena,telefono,foto} = req.body;

  const userRepository = AppDataSource.getRepository(Cliente);
  const user = new Cliente(usuario,correo,contrasena,telefono,foto); 
  await userRepository.save(user);

  await producer.send({
    topic: 'user-created',
    messages: [{ value: JSON.stringify({ usuario,correo,contrasena,telefono,foto }) }],
  });

  res.status(201).send('User created');
});
*/







app.listen(port, () => {
  console.log(`User service is running at http://localhost:${port}`);
});
