import { Show } from '../models/showsModel.js'; 

// Create a new show
export const createShow = async (req, res) => {
  try {
    const { theaterId, movieId, showTime, availableSeats,price, seats } = req.body;

  if (!theaterId || !movieId || !showTime || !availableSeats ||!price|| !seats ) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (
      !theaterId || !movieId || 
      theaterId.trim() === '' || movieId.trim() === '' ||
      !showTime || !availableSeats || !price || !seats
    ) {
      return res.status(400).json({ error: 'All fields are required and must be non-empty' });
    }
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: 'Seats must be an array with at least one seat' });
    }
    for (const seat of seats) {
      if (!seat.seatId || !seat.seatLabel || !seat.seatType || !seat.basePrice || !seat.premiumPrice) {
        return res.status(400).json({ error: 'Each seat must have seatId, seatLabel, seatType, basePrice, and premiumPrice' });
      }
      if (!['Standard', 'VIP', '3D'].includes(seat.seatType)) {
        return res.status(400).json({ error: `Invalid seat type: ${seat.seatType}` });
      }
    }
    // Check if the showTime overlaps with any other show at the same theater
    const existingShow = await Show.findOne({
      theaterId,
      showTime: { $gte: new Date(showTime) }, // check if the time overlaps
    });

    if (existingShow) {
      return res.status(400).json({ error: 'There is already a show scheduled at this time in this theater.' });
    }
    const groupedBySeatType = {};

    seats.forEach(seat => {
      const rowLabel = seat.seatLabel[0]; // e.g., A1 → A
      const seatType = seat.seatType;
      const price = ['Standard'].includes(seatType) ? seat.basePrice : seat.premiumPrice;

      if (!groupedBySeatType[seatType]) {
        groupedBySeatType[seatType] = {};
      }

      if (!groupedBySeatType[seatType][rowLabel]) {
        groupedBySeatType[seatType][rowLabel] = [];
      }
      groupedBySeatType[seatType][rowLabel].push({
        seatId: seat.seatId,
        seatLabel: seat.seatLabel,
        price,
        isBooked: false,
      });
    });

    const seatTypes = Object.entries(groupedBySeatType).map(([seatType, rowsObj]) => ({
      seatType,
      rows: Object.entries(rowsObj).map(([rowLabel, seats]) => ({
        rowLabel,
        seats,
      })),
    }));

    // Create a new show document
    const newShow = new Show({
      theaterId,
      movieId,
      showTime,
      availableSeats,
      price,
      //seats, // Add the seat details directly to the seats array
      seatTypes,
    });

    // Save the new show to the database
    await newShow.save();

    return res.status(201).json({
      message: 'Show created successfully',
      show: newShow,
    });
  } catch (error) {
    console.error('Error creating show:', error); // Log the error for debugging
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};


// Get all shows
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('theaterId movieId'); // Populate the referenced fields
    res.status(200).json({data:shows,message:"fetched all theatre shows" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};

// Get a show by its ID
export const getShowById = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await Show.findById(showId).populate('theaterId movieId');

    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.status(200).json({sucess:true,data:show,message: "feched show by theater id sucessfully"});
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};


// Get shows by movie ID
export const getShowsByMovie = async (req, res) => {
  const { movieId } = req.params;

  try {
    // Find shows that match the provided movieId
    const shows = await Show.find({ movieId }).populate('theaterId');  // Populate theater data if needed

    // If no shows are found for the given movieId
    if (!shows||shows.length === 0) {
      return res.status(404).json({ error: 'No shows found for this movie.' });
    }
  res.status(200).json({shows ,message:"feched show by movie id sucessfully"});
  } catch (error) {
    // Handle any errors that might occur
    
  }
};

// Get shows by theater ID
export const getShowsByTheater = async (req, res) => {
  const { theaterId } = req.params;

  try {
    // Find shows that match the provided theaterId
    const shows = await Show.find({ theaterId }).populate('movieId');  // Populate movie data if needed

    // If no shows are found for the given theaterId
    if (shows.length === 0) {
      return res.status(404).json({ error: 'No shows found for this theater.' });
    }

    // If shows are found, return them in the response
    res.status(200).json({ shows });
  } catch (error) {
    // Handle any errors that might occur
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};


// Update a show
export const updateShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const { showTime, availableSeats, price, seats} = req.body;
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: 'Seats must be an array and contain at least one seat' });
    }

    // Validate each seat
    for (const seat of seats) {
      if (!seat.seatId || !seat.seatLabel || !seat.seatType || !seat.basePrice || !seat.premiumPrice) {
        return res.status(400).json({ error: 'Each seat must have seatId, seatLabel, seatType, basePrice, and premiumPrice' });
      }
      if (!['Standard', 'VIP', '3D'].includes(seat.seatType)) {
        return res.status(400).json({ error: `Invalid seat type: ${seat.seatType}` });
      }
    }
    // Find the show and update it
    const updatedShow = await Show.findByIdAndUpdate(
      showId,
      {
        showTime,
        availableSeats,
        price,
        seats,
        
      },
      { new: true } // Returns the updated document
    );

    if (!updatedShow) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.status(200).json({ message: 'Show updated successfully', updatedShow });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// Delete a show
export const deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;

    // Find the show and delete it
    const deletedShow = await Show.findByIdAndDelete(showId);

    if (!deletedShow) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.status(200).json({data:deletedShow , message: 'Show deleted successfully'});
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete show', details: error.message });
  }
};

// Add a new ticket type to a show
// Add a new seat type to a show
export const addSeatTypeToShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatId, seatLabel, seatType, basePrice, premiumPrice } = req.body;

    // Find the show and add a new seat
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    // Push the new seat to the seats array
    show.seats.push({ seatId, seatLabel, seatType, basePrice, premiumPrice });

    // Save the updated show
    await show.save();

    res.status(200).json({ message: 'Seat type added successfully', show });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// Update a seat type in a show
export const updateSeatTypeInShow = async (req, res) => {
  try {
    const { showId, seatId } = req.params;
    const { seatLabel, seatType, basePrice, premiumPrice } = req.body;

    // Find the show and the seat to update
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    const seat = show.seats.find(seat => seat.seatId === seatId);
    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    // Update the seat fields
    seat.seatLabel = seatLabel || seat.seatLabel;
    seat.seatType = seatType || seat.seatType;
    seat.basePrice = basePrice || seat.basePrice;
    seat.premiumPrice = premiumPrice || seat.premiumPrice;

    // Save the updated show
    await show.save();

    res.status(200).json({ message: 'Seat type updated successfully', show });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// Delete a seat type from a show
export const deleteSeatTypeFromShow = async (req, res) => {
  try {
    const { showId, seatId } = req.params;

    // Find the show and remove the seat type
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    const seatIndex = show.seats.findIndex(seat => seat.seatId === seatId);
    if (seatIndex === -1) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    // Remove the seat type from the seats array
    show.seats.splice(seatIndex, 1);

    // Save the updated show
    await show.save();

    res.status(200).json({ message: 'Seat type deleted successfully', show });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete seat type', details: error.message });
  }
};
