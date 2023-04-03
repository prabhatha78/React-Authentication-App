const express =require('express');
const app =express();
const path = require('path');
const cors = require('cors');
const db = require('./config/db');
const userRouter=require('./router/userRouter');
const adminRouter=require('./router/adminRouter')
const cookieParser = require('cookie-parser');
const logger = require('morgan');



app.use(
    cors({
        origin:['http://localhost:3000'],
        methods:["GET","POST","DELETE","PUT"],
        credentials:true
    })
);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

db(() => {
    try {
        console.log("DataBase Successfully Connected");
    } catch (error) {
        console.log("Database Not Connected : ", error);
    }
});





app.use(cookieParser());
app.use(express.json());
app.use('/',userRouter);
app.use('/admin', adminRouter);


app.listen(4000, () => {
    console.log('Server started on PORT 4000');
})