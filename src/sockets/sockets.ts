import { io } from "..";
import { Store } from "../models/store.model";
import User from "../models/user.model";
// handling sockets;
export const handleSockets = () => {
  io.on("connection", (socket) => {
    // console.log("user connected", socket.id);
    // for normal user;
    socket.on("store-socketId", async (userId) => {
      try {
        await User.findByIdAndUpdate(userId, {
          $set: {
            isOnline: true,
            socketId: socket.id,
          },
        });

        const isStoreOwner = await Store.findOne({ ownerId: userId });
        if (isStoreOwner) {
          io.emit("ownerStatus", { storeId: isStoreOwner._id, isOnline: true });
        }
      } catch (error) {
        console.log("ERROR:DURING storing socketIds", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            $set: {
              isOnline: false,
            },
          }
        );

        const isStoreOwner = await Store.findOne({ ownerId: user?._id });
        if (isStoreOwner) {
          io.emit("ownerStatus", {
            storeId: isStoreOwner._id,
            isOnline: false,
          });
        }
      } catch (error) {
        console.log("Error while disconnecting sockets", error);
      }
    });
  });
};
