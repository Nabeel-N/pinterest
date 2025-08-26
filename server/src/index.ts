import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signupSchema } from "./zod";
import jwt from "jsonwebtoken";
import { email, safeParse, string } from "zod";
import { authMiddleware } from "./middleware";
import { createPinSchema } from "./zod";
import { ca } from "zod/v4/locales/index.cjs";
import upload from "./multer-config";
const app = express();
const prisma = new PrismaClient();
import { updatePinSchema } from "./zod";
import { CreateCommentSchema } from "./zod";
import { CreateLikeSchema } from "./zod";
import { createBoardSchema } from "./zod";
import { addPinToBoardSchema } from "./zod";
import { findPackageJSON } from "module";
app.use(cors());
app.use(express.json());
// multer
app.use('/uploads', express.static('uploads'));

app.post("/api/signup", async (req, res) => {
  try {
    const validatedInput = signupSchema.safeParse(req.body);

    if (!validatedInput.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: validatedInput.error.flatten().fieldErrors,
      });
    }

    const { email, password, name } = validatedInput.data;

    const saltRoundsString = process.env.BCRYPT_SALT_ROUNDS || "10";
    const saltRounds = parseInt(saltRoundsString, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });

    res.status(201).json({
      message: "You signed up successfully!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
});

app.post("/api/signin" , async (req ,res )=>{
  try{
      const validatedInput = signupSchema.safeParse(req.body);
      if(!validatedInput.success){
        return res.status(400).json({
          message:"Invalid email or password"
        })
      }

      const email = validatedInput.data.email;
      const password = validatedInput.data.password;


      const user = await prisma.user.findUnique({
        where:{
          email:email,
        }
      })

      if(!user || !( await bcrypt.compare(password , user.password))){
        return res.status(401).json({
          message:"Invalid Credentials"
        })
      }

         const payload = {
          userId: user?.id,
          email : user?.email,
          name:user?.name
         }

         const token = jwt.sign(payload, process.env.JWT_SECRET as string);

         res.status(200).json({
           message: "Signed in successfully!",
           token: token,
         });


  }
  catch(error){
       console.error(error);
       res.status(500).json({ message: "Something went wrong" });
  }  

})

// in your main server file (e.g., index.ts)



app.post("/api/pins", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    // req.file is the 'image' file
    // req.body will hold the text fields, if there were any

    const dataToValidate = {
      title: req.body.title,
      externallink: req.body.externallink,
      image: req.file, // Pass the file object to Zod
    };

    const validatedInput = createPinSchema.safeParse(dataToValidate);

    if (!validatedInput.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: validatedInput.error.flatten().fieldErrors,
      });
    }

    // The path where the image is stored
    const imageUrl = `/uploads/${req.file?.filename}`;
    const userId = req.user.userId;

    const newPin = await prisma.pin.create({
      data: {
        title: validatedInput.data.title,
        image: imageUrl, // Save the path to the image
        externallink: validatedInput.data.externallink,
        authorId: userId,
      },
    });

    res.status(201).json(newPin);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});


app.get("/api/pins", async (req, res) => {
  try {
    const pins = await prisma.pin.findMany({
      orderBy: {
        id: "desc", // Show the newest pins first
      },
      include: {
        author: {
          select: { // Only include the author's name and id
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json(pins);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/api/pins/:id" , authMiddleware  , async (req , res ) =>{ 
    try{
      const id = req.params.id;
    const findpin =   await prisma.pin.findUnique({ 
        where:{
          id:parseInt(id)
        },
        include:{
          author:{
            select:{
              id:true,
              name:true,
            }
          },
          comments:{
            include:{
              author:{select:{
                id:true,
                name:true,
              }}
            }
          }
        }
      })

      if(!findpin){
        return res.status(404).json({
          message:"pin is not found"
        })
      }

      return res.status(201).json(findpin);


    }catch(e){
      console.error(e)
        res.status(500).json({ message: "Something went wrong" });
    }
})


app.put("/api/pins/:id" , authMiddleware , async (req , res)=>{
  try{
      const id = req.params.id;
      const userId = req.user.userId;


      const findpintoEdit = await prisma.pin.findUnique({
        where:{
          id:parseInt(id),
        },
        include:{
          author:{
            select:{
              id:true,
            }
          }
        }
      })

      if(!findpintoEdit){
        return res.status(404).json({
          message:"id not found"
        })
      }

      if(findpintoEdit.author.id != userId ){
        return res.status(401).json({
          message:"There is no user with this id"
        })
      }
      

      const validatedInput = updatePinSchema.safeParse(req.body);
      if(!validatedInput.success){
       return res.status(400).json({
         message: "Invalid input",
         errors: validatedInput.error.flatten().fieldErrors,
       });
      }


      const updatePin = await prisma.pin.update({
        where:{
          id:parseInt(id),
        },
        data:validatedInput.data
      })


      return res.status(200).json(updatePin);


  }
  catch(e){
    console.error(e);
    res.status(404).json({
      message:"there is some error occured"
    })
  }
    


})


app.delete("/api/pins/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const pinToDelete = await prisma.pin.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!pinToDelete) {
      return res.status(404).json({ message: "Pin not found" });
    }

    if (pinToDelete.authorId !== userId) {
      return res
        .status(403)
        .json({
          message: "Forbidden: You do not have permission to delete this pin",
        });
    }

   const deleted =  await prisma.pin.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).send({
      message:"Pin deleted successfully",
      data: deleted
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });

  }
});


  app.post("/api/pins/:pinId/comments" , authMiddleware , async (req , res) =>{
    const userId = req.user.userId;
    const pinId = parseInt(req.params.pinId);
    console.log(pinId)

    const validatedInput = CreateCommentSchema.safeParse(req.body);

    if (!validatedInput.success) {
      return res.status(400).json({
        message: "this is not a valid input"
      });
    }
    const created = await prisma.comments.create({
      data: {
        text: validatedInput.data.text,
        commentsauthor: userId,
        authorpinID: pinId
      }
    });
    return res.status(201).json(created);
  })


    app.post("/api/pins/:pinId/likes", authMiddleware, async (req, res) => {
      try {
        const userId = req.user.userId;
        const pinId = parseInt(req.params.pinId);

        const validatedInput = CreateLikeSchema.safeParse(req.body);

        if (!validatedInput.success) {
          return res.status(400).json({
            message: "this is not a valid input",
          });
        }

        // Check if the like already exists without a composite unique
        const existingLike = await prisma.likes.findFirst({
          where: {
            likesauthor: userId,
            authorlikesID: pinId,
          },
        });

        if (existingLike) {
            await prisma.likes.delete({
            where: {
              id: existingLike.id,
            },
          });
          return res.status(200).json({
            message: "deleted",
            removed: true,
          });
        } else {
            await prisma.likes.create({
            data: {
              likesauthor: userId,
              authorlikesID: pinId,
            },
          });
           return res.status(200).json({
             message: "Like created successfully",
           });
        }

       
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Something went wrong" });
      }

    });


app.post("/api/boards", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const validatedInput = createBoardSchema.safeParse(req.body);

    if (!validatedInput.success) {
      return res.status(400).json({
        message: "This is not a valid input for boards",
        errors: validatedInput.error.flatten().fieldErrors,
      });
    }

    const newBoard = await prisma.board.create({
      data: {
        name: validatedInput.data.name,
        authoridBoard: userId,
      },
    });

    return res.status(201).json(newBoard);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});



app.post("/api/boards/:boardId/pins", authMiddleware, async (req, res) => {
  try{  
    const userId = req.user.userId;
    const boardId = req.params.boardId; 
    const pinId = req.body.pinId;
console.log(pinId)
    const validatedInput = addPinToBoardSchema.safeParse(req.body);
    console.log(validatedInput)
    if(!validatedInput.success){
     return  res.status(400).json({
        message:"NOT A VALID INPUT"
      })
    }

    const FindBoard = await prisma.board.findUnique({
      where :{
        id:parseInt(boardId)
      }
    })

    if(!FindBoard){
      return res.status(404).json({
        message:"Cant find the Board"
      })
    }

    if(FindBoard.authoridBoard != userId){
      return res.status(403).json({
        message:"This is not a VALID USER"
      })
    }

    const updatedBoard = await prisma.board.update({
      where:{
        id:parseInt(boardId),
      },
      data:{
        pins:{
          connect:{
            id:pinId
          },
        },
      },

      include:{
        pins:true
      }
    })

    return res.status(200).json(updatedBoard);
  }
    catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
    }
    
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
