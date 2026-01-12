import express, {Request, Response} from "express"
import cors from "cors"

const port = 5002;

const app = express();
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send("Salut frate, merge ghine ghine");
    console.log("salut frate")
});

app.listen(port, () => {
    console.log("Server ul merge pe portul : ", port);
})

