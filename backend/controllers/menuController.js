import Menu from "../models/menuModel.js";
import Offer from "../models/offerModel.js";
import {v2 as cloudinary} from "cloudinary";

export const addMenuItem=async(req,res)=>{
   try {
      const {name,description,price,category}=req.body;
       if (!name || !description || !price || !category || !req.file) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
     const result=await cloudinary.uploader.upload(req.file.path);

     const newMenuItem=await Menu.create({
      name,description,price,category,image:result.secure_url
     })
       res.status(201).json({
      message: "Menu item added",
      success: true,
      menuItem: newMenuItem,
    });
   } catch (error) {
            console.log(error);
             return res.json({message:"Internal server error",success:false})
   }
}

export const getAllMenuItems=async(req,res)=>{
   try {
      const menuItems=await Menu.find().populate("category","name").sort({createdAt:-1});
      
      // Fetch all active offers
      const offers = await Offer.find({
         isActive: true,
         $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: new Date() } },
         ],
         $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: new Date() } },
         ],
      });
      
      // Add applicable offers to each menu item
      const menuItemsWithOffers = menuItems.map(item => {
        const applicableOffers = offers.filter(offer => {
          // Check if offer applies to all items
          if (offer.appliesTo === "all") return true;
          
          // Check if offer applies to specific menu item
          if (offer.appliesTo === "menu" && offer.menuItem) {
            return offer.menuItem.toString() === item._id.toString();
          }
          
          // Check if offer applies to category
          if (offer.appliesTo === "category" && offer.category) {
            return offer.category.toString() === item.category._id.toString();
          }
          
          return false;
        });
        
        return {
          ...item.toObject(),
          offers: applicableOffers
        };
      });
      
        res.status(200).json({ success: true, menuItems: menuItemsWithOffers });
   } catch (error) {
      console.log(error);
             return res.json({message:"Internal server error",success:false})
   }
}

export const getMenuItemById=async(req,res)=>{
   try {
      const {id}=req.params;
      const menuItem=await Menu.findById(id).populate("category","name");
      if (!menuItem)
      return res
        .status(404)
        .json({ message: "Menu item not found", success: false });
        res.status(200).json({ success: true, menuItem });
   } catch (error) {
      console.log(error);
             return res.json({message:"Internal server error",success:false})
   }
}

export const updateMenuItem=async(req,res)=>{
   try {
      const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;

    const menuItem=await Menu.findById(id);
      if (!menuItem)
      return res
        .status(404)
        .json({ message: "Menu item not found", success: false });

        if(req.file){
               const result=await cloudinary.uploader.upload(req.file.path);
               menuItem.image=result.secure_url;

      }
       if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = price;
    if (category) menuItem.category = category;
      if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

      await menuItem.save();
        res
      .status(200)
      .json({ message: "Menu item updated", success: true, menuItem });
   } catch (error) {
           console.log(error);
             return res.json({message:"Internal server error",success:false})
   }
}

export const deleteMenuItem=async(req,res)=>{
   try {
      const {id}=req.params;
      const menuItem=await Menu.findByIdAndDelete(id);
       res.status(200).json({ success: true, message: "Menu item deleted" });
   } catch (error) {
        console.log(error);
             return res.json({message:"Internal server error",success:false})
   }
}