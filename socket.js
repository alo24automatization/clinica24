// socket.js
const socketIo = require('socket.io');
const {getDepartments} = require("./routers/offlineclient/clients.route");

const initializeSocket = (server) => {
    const io = socketIo(server,{
        path: '/ws',
        cors: {
            origin: ["http://localhost:3000", "https://unical-med.uz"],
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        socket.on('getDepartments', async (data) => {
            const { clinicaId, departments_ids } = data;
            try {
                const departments = await getDepartments(clinicaId, departments_ids);
                io.emit('departmentsData', departments);
            } catch (error) {
                console.error(error);
                socket.emit('error', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

module.exports = initializeSocket;
