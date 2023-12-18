import express from 'express'
import cors from 'cors'
import shell from 'shelljs'
import * as db from './database.js'

var app = express();

const corsOptions ={
   origin:'*', 
   credentials:true,      
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());

app.get('/', function(req, res) {
   res.send("Hello world!");
});

app.post("/register", async function(req, res) {
	console.log(req.body);
	let result = await db.newUser(req.body);
	res.send(result);
	console.log(result);
});

app.post("/login", async function(req, res) {
	console.log(req.body);
	let result = await db.login(req.body);
	if (result === false)
		res.status(400).send(result);
	else 
		res.status(200).send(result);
});

app.delete("/delete_user", async function(req, res) {
	console.log(req.body);
	let result = await db.deleteUser(req.body);
	if (result === false)
		res.status(400).send(result);
	else 
		res.status(200).send(result);
});

app.post("/user_data", async function(req, res) {
	console.log(req.body);
	let result = await db.getUser(req.body);
	if (result === false)
		res.status(400).send(result);
	else 
		res.status(200).send(result);
});

// http://localhost:8080/static/airline_logos/MLD.png

app.use('/static', express.static('public'))
app.listen(8080);
