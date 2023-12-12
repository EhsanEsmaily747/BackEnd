import User from "../models/user.js";
import { catchAsync } from "../middlewares.js";
import jsonwebtoken from "jsonwebtoken";












export const getAll = catchAsync(async (req, res) => {
  let filter = {}
  
  if (req.query.id) filter._id = req.query.id
  if (req.query.searchTerm) {
    let regex = new RegExp(req.query.searchTerm, "i");
    filter.$or = [{ title: regex }];
  }
  let users = await User.find(filter);
  if (filter.$or) {
    res.status(200).json({ message: '', users : users})
  }
  if (filter._id){
    res.status(200).json({ message: "", users: users });
  }
  res.status(200).json({ message: "", users: users.length });
});


export const deleteUser = catchAsync(async(req, res) => {
  const {id}=req.params;

  try{
    const user=await User.findById(id);
    console.log(user);

    if(user){
      user.deleteOne;
      return res.status(200).json({message:"User Deleted",user:user})
    }
    return res.status(404).json({message:"User not Found"})
  }catch(err){
    res.status(500).json({message:"Invalid Operation"})
  }
});


export const updateUser = catchAsync(async (req, res) => {
  
  const {id}=req.params;
  const {updatedUser}=req.body;

  try{
    const user=await User.findById(id);
    if(!user){
      return res.status(404).json({message: "User doesn't exits"})
    }
    
    user.username=updatedUser.username;
    user.email=updatedUser.email;
    user.password=updatedUser.password;
    user.picture=updatedUser.picture;
    user.isAdmin=updatedUser.isAdmin;
    user.save();

    res.status(200).json({message:"user updated", user:user})

  }catch(err){
  res.status(500).json({message:"Invalid User Info", error:err.message})
  }
});


export const createUser = catchAsync(async(req, res) => {

  const { newUser } = req.body;

  const existUser = await User.find({ email:email });
  console.log(existUser)
  if (existUser.length >0) {
    return res.status(500).json({ message: "user already exist" });
  }

  const user = await User.create({
    username: newUser.username,
    email: newUser.email,
    password: newUser.password,
    picture: newUser.picture,
    isAdmin: false,
  });

  return res.status(201).json({ user: user });
});


export const login = catchAsync(async (req, res) => {
    
  const filter={}

  const {userData}= req.body
  console.log(userData);
  filter.username = userData.username
  
  const user = await User.find(filter)
  console.log(user);
  
  if(user.length!=0){
      if(user[0].password == userData.password){
       
         const  token = jsonwebtoken.sign(
                  { 
                  id: user[0]._id,
                  isAdmin: user[0].isAdmin,
                  pic: user[0].picture,
                  name: user[0].username
                  },
                  process.env.SECRET_KEY,
                  {
                   expiresIn: '3d'
                  }
          )
      
          res.status(201).json({message:'', token : token})
      
      }else{
          res.status(201).json({message:'Wrong Password'})
      }
      
  }
  res.status(201).json({ message: "Invalid Username"});
});



export const  singUp = catchAsync( async (req,res)=>{

  const { newUser } = req.body
  const { username, email, password } = newUser
  const anonymous = 'https://uhqrkikymwnejdgghkus.supabase.co/storage/v1/object/public/Images/public/anonymous.jpg'
  
  const existUser = await User.find({ email: email });
  if (existUser.length > 0) {
      res.status(201).json({ message: 'User Exist' })
  }
  
  
  const createdUser = await User.create({
      username: username,
      email: email,
      password: password,
      picture: anonymous,
      isAdmin: false,
  });
  const token = jwt.sign(
      {
          id: createdUser._id,
          isAdmin: createdUser.isAdmin,
          pic: createdUser.picture,
          name: createdUser.username
      },
      process.env.SECRET_KEY,
      {
          expiresIn: '3d'
      }
  )
  res.status(201).json({message: 'User Registered', token : token })
})