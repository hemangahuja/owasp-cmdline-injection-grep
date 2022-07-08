import { exec } from 'child_process';
import express, { Express, Request, Response } from 'express';
import path from 'path';

const app : Express = express();

interface Body{
    hay : string,
    needle : string
}

app.use(express.json());

app.get(`/`,(req : Request , res : Response)=>{
    res.sendFile(path.join(__dirname,'/index.html'));
});

app.post(`/find`,(req : Request,res : Response)=>{
    const {hay , needle} : Body  = req.body;

    exec(`grep "${needle}" <<< "${hay}" -b -o`, {shell : "/bin/bash"} ,(error,stdout,stderr)=>{
      
        if(error){ 
            res.status(400).json({error}).end();
        } else if(stderr){
            res.status(500).json({error : stderr}).end();
        } else {
            res.status(200).json({data : stdout}).end();
        }
    })

})
app.listen(3000,()=>{
    console.log(`listening at port ${3000}`);
})