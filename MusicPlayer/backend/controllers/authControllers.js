import User from "../models/userModel.js";

const  signup = async (req, res) => {
    try {

        //get the data
        const { name, email, password, avatar } = req.body;

        //Check the data is correct or not?
        if(!name || !email || !password){
            return res.status(400).json({ message : "Name, password and email are required" });
        }
        //Existing User?
        const userExist = await User.findOne({ email : email });
        if(userExist){
            return res.status(400).json({ message : "Email already Exists!!"});
        }
        //Create User if doesn't exists
        const user = await User.create({ name, email, password, avatar });
        return res.status(201).json({ message : "User Created Succesfully",
            user : {
                id : user._id,
                name : user.name,
                eamil : user.email,
                avatar : user.avatar,
            },
         });

    } catch (error) {
        console.error("SignUp Error", error);
        res.status(500).json({
            message : "Internal Server Error"
        });
    }
}
const login = (req, res) => {
    try {
        res.status(200).json({
            message: "Lock IT!"
        });
    } catch (error) {
        console.error("Shit", error);
    }
}

export { signup, login };