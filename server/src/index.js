import app from "./app.js";
import dotenv from 'dotenv'
import db from "./db/index.js"

dotenv.config({ path: '' });

const port=process.env.PORT||3001

db().
then(()=>{
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })

})
