import Tutor from "../Models/tutorModel.js";

const handleSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("tutorStatusUpdate", async ({ tutorId, status }) => {
      console.log(`Tutor ${tutorId} status updated to: ${status}`);

      try {
        const tutor = await Tutor.findById(tutorId);
        if (tutor) {
          tutor.online = status;
          await tutor.save();
          io.emit("tutorStatusChanged", { tutorId, status });
        }
      } catch (err) {
        console.error("Error updating tutor status:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

export default handleSocketEvents;
