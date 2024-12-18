import mongoose from "mongoose";

export const dbConnection = async () => {
  const cadenaConnection = process.env.DB_CNN_STRING || "";

  try {
    await mongoose.connect(cadenaConnection, {
      autoIndex: true,
    });

    console.log("Database online");
  } catch (error) {
    console.log(error);
    throw new Error("Error en la base de datos");
  }
};
