import app from "./server";
import colors from 'colors';

const port: string | number = process.env.PORT || 4400


app.listen(port,() => {
    console.log(colors.blue.italic("listening on port: "+ port));
})