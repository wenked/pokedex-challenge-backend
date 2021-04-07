import 'reflect-metadata';
import routes from './routes';
import { createConnection } from 'typeorm';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(routes);
app.use(express.json());

(async () => {
	try {
		await createConnection();

		app.listen(process.env.PORT, () => {
			console.log(`Server is up and listening on port ${process.env.PORT}.`);
		});
	} catch (err) {
		console.log(err);
	}
})();
