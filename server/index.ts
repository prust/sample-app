import express, { Request, Response } from "express";

let app = express();
console.log(`${__dirname}/../client`);
app.use(express.static(`${__dirname}/../client`));
// app.get("/", function (req: Request, res: Response) {
//   res.send("Express/typescript demo");
// });

app.listen(8080, function () {
  console.log(`server is running on localhost`);
});
