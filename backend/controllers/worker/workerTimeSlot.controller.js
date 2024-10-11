const WorkerTimeSlot = require('../../models/worker/workerTimeSlot.model.js');
const Worker = require('../../models/worker/worker.model.js');
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    if (token) {
        jwt.verify(token, '2fe3ce2f', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Get slots by worker token
const getSlotsByWorkerToken = async (req, res) => {
    try {
        const { userId } = req.user.userId;
        const worker = await Worker.findOne({ userId: userId });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found for this user' });
        }
        const workerId = worker._id;
        const timeSlots = await WorkerTimeSlot.findOne({ workerId }).populate('occupiedSlots.jobId');
        if (!timeSlots) {
            return res.json([]);
        }
        res.json(timeSlots);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get slots by worker ID
const getSlotsByWorkerId = async (req, res) => {
    try {
        const { workerId } = req.params;
        const timeSlots = await WorkerTimeSlot.findOne({ workerId }).populate('occupiedSlots.jobId');
        if (!timeSlots) {
            return res.json([]);
        }
        res.json(timeSlots);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Update occupied or blocked slots
const updateSlots = async (req, res) => {
    try {
        const { workerId } = req.params;
        const { occupiedSlots, blockedSlots } = req.body;
        console.log("occupiedSlots: ", req.body);

        // Check if worker time slot exists
        let timeSlot = await WorkerTimeSlot.findOne({ workerId });

        if (!timeSlot) {
            // Create a new time slot if it doesn't exist
            timeSlot = new WorkerTimeSlot({
                workerId,
                occupiedSlots: occupiedSlots || [],
                blockedSlots: blockedSlots || [],
            });
            await timeSlot.save();
            console.log("New time slot created");
        } else {
            // Update existing time slot
            // Merge new occupied slots into existing ones
            if (occupiedSlots) {
                occupiedSlots.forEach(slot => {
                    const newSlot = {
                        from: slot.from, // Expecting 'HH:MM'
                        to: slot.to,     // Expecting 'HH:MM'
                        date: slot.date, // Date for clarity
                        jobId: slot.jobId || undefined, // Only include jobId if it's defined
                    };

                    // Check if the slot already exists in occupiedSlots
                    const exists = timeSlot.occupiedSlots.some(existingSlot => existingSlot.jobId && existingSlot.jobId.toString() === newSlot.jobId);
                    if (!exists) {
                        timeSlot.occupiedSlots.push(newSlot); // Add new slot if it doesn't exist
                        console.log(`Occupied slot added: ${JSON.stringify(newSlot)}`);
                    } else {
                        console.log(`Occupied slot already exists: ${JSON.stringify(newSlot)}`);
                    }
                });
            }

            // Merge new blocked slots into existing ones
            if (blockedSlots) {
                blockedSlots.forEach(slot => {
                    const newSlot = {
                        from: slot.from, // Expecting 'HH:MM'
                        to: slot.to,     // Expecting 'HH:MM'
                        date: slot.date, // Date for clarity
                        jobId: slot.jobId || undefined, // Only include jobId if it's defined
                    };

                    // Check if the slot already exists in blockedSlots
                    const exists = timeSlot.blockedSlots.some(existingSlot => existingSlot.jobId && existingSlot.jobId.toString() === newSlot.jobId);
                    if (!exists) {
                        timeSlot.blockedSlots.push(newSlot); // Add new slot if it doesn't exist
                        console.log(`Blocked slot added: ${JSON.stringify(newSlot)}`);
                    } else {
                        console.log(`Blocked slot already exists: ${JSON.stringify(newSlot)}`);
                    }
                });
            }

            await timeSlot.save();
            console.log("Time slot updated");
        }

        // Send the updated time slots back as a response
        res.json(timeSlot);
    } catch (error) {
        console.error('Error updating time slots:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// Update occupied or blocked slots using token
const updateSlotsToken = async (req, res) => {
    try {
        const { userId } = req.user.userId;
        const worker = await Worker.findOne({ userId: userId });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found for this user' });
        }
        const workerId = worker._id;
        const { occupiedSlots, blockedSlots } = req.body;

        // Check if worker time slot exists
        let timeSlot = await WorkerTimeSlot.findOne({ workerId });

        if (!timeSlot) {
            // Create a new time slot if it doesn't exist
            timeSlot = new WorkerTimeSlot({
                workerId,
                occupiedSlots: occupiedSlots || [],
                blockedSlots: blockedSlots || [],
            });
            await timeSlot.save();
        } else {
            // Update existing time slot
            // Merge new occupied slots into existing ones
            if (occupiedSlots) {
                occupiedSlots.forEach(slot => {
                    // Create a new slot object with string times
                    const newSlot = {
                        from: slot.from,
                        to: slot.to,
                        date: slot.date,
                        jobId: slot.jobId,
                    };
                    // Check if the slot already exists in occupiedSlots
                    const exists = timeSlot.occupiedSlots.some(existingSlot => existingSlot.jobId.toString() === newSlot.jobId);
                    if (!exists) {
                        timeSlot.occupiedSlots.push(newSlot); // Add new slot if it doesn't exist
                    }
                });
            }

            // Merge new blocked slots into existing ones
            if (blockedSlots) {
                blockedSlots.forEach(slot => {
                    // Create a new slot object with string times
                    const newSlot = {
                        from: slot.from,
                        to: slot.to,
                        date: slot.date,
                        jobId: slot.jobId,
                    };
                    // Check if the slot already exists in blockedSlots
                    const exists = timeSlot.blockedSlots.some(existingSlot => existingSlot.jobId.toString() === newSlot.jobId);
                    if (!exists) {
                        timeSlot.blockedSlots.push(newSlot); // Add new slot if it doesn't exist
                    }
                });
            }

            await timeSlot.save();
        }

        res.json(timeSlot);
    } catch (error) {
        console.error('Error updating time slots:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Delete slots
const deleteSlots = async (req, res) => {
    try {
        const { workerId } = req.params;
        const { slotId, type } = req.body; // type can be 'occupied' or 'blocked'

        const updateField = type === 'occupied' ? 'occupiedSlots' : 'blockedSlots';
        const updatedTimeSlot = await WorkerTimeSlot.findOneAndUpdate(
            { workerId },
            { $pull: { [updateField]: { _id: slotId } } },
            { new: true }
        );

        if (!updatedTimeSlot) {
            return res.status(404).json({ message: 'No time slot found to delete.' });
        }

        res.json(updatedTimeSlot);
    } catch (error) {
        console.error('Error deleting time slots:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    authenticateJWT,
    getSlotsByWorkerToken,
    getSlotsByWorkerId,
    updateSlots,
    updateSlotsToken,
    deleteSlots
};