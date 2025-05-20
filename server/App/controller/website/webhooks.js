const { userModel } = require('../../model/userModel');

require('dotenv').config();


const clerkWebhook = async (req, res) => {

     try {
          const { Svix } = await import('svix');

          const whook = new Svix(process.env.CLERK_WEBHOOK_KEY);


          await whook.verify(JSON.stringify(req.body),{
               "svix-id": req.headers["svix-d"],
                "svix-timestamp": req.headers["svix-timestamp"],
                 "svix-signature": req.headers["svix-signature"],
          })

          //getting data from request body
          const {data,type}= req.body

          switch (type) {
               case "user.created":{



                    const userdata= {
                         _id: data.id,
                         userEmail:data.email_addresses[0].email_address,
                         userName:data.first_name+" "+ data.last_name,
                         userPic: data.image_url,
                         resume:""
                    }
                    await userModel.create(userdata)
                    res.json({})
                    break;
               }
               case "user.updated":{
                    const userdata= {
                        
                         userEmail:data.email_addresses[0].email_address,
                         userName:data.first_name+" "+ data.last_name,
                         userPic: data.image_url,
                        
                    }
                    await userModel.findByIdAndUpdate(data.id, userdata)
                    res.json({})
                    break;

               }
               case "user.deleted":{

                    await userModel.findByIdAndDelete(data.id)
                    res.json({})
                    break;

               }
               default:
                    break;
          }
     } catch (error) {


          console.log(error.message)
          res.json({sucess: "fail", message:`webhook error`})

     }

}

module.exports={clerkWebhook}