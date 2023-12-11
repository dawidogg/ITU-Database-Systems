import express from 'express'
import cors from 'cors'

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

app.post("/register", function(req, res) {
	res.send('ok');
	console.log(req.body);
});

app.listen(8080);
