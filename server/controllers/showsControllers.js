import { Show } from '../models/showsModel.js'; 

// Create a new show
export const createShow = async (req, res) => {
  try {
    const { theaterId, movieId, showTime, availableSeats, price, ticketTypes } = req.body;

  if (!theaterId || !movieId || !showTime || !availableSeats || !price || !ticketTypes) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate the ticket types
    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
      return res.status(400).json({ error: 'Ticket types must be an array with at least one item' });
    }

    // Validate each ticket type
    for (const ticket of ticketTypes) {
      if (!ticket.type || !['standard', 'VIP', '3D', 'IMAX'].includes(ticket.type)) {
        return res.status(400).json({ error: `Invalid ticket type: ${ticket.type}` });
      }
      if (!ticket.basePrice || !ticket.premiumPrice) {
        return res.status(400).json({ error: 'Both basePrice and premiumPrice are required for each ticket type' });
      }
    }

    // Create a new show document
    const newShow = new Show({
      theaterId,
      movieId,
      showTime,
      availableSeats,
      price,
      ticketTypes,
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
    if (shows.length === 0) {
      return res.status(404).json({ error: 'No shows found for this movie.' });
    }
  res.status(200).json({ data:shows ,message:"feched show by movie id sucessfully"});
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
    const { showTime, availableSeats, price, ticketTypes} = req.body;

    // Find the show and update it
    const updatedShow = await Show.findByIdAndUpdate(
      showId,
      {
        showTime,
        availableSeats,
        price,
        ticketTypes
        
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
export const addTicketTypeToShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const { type, basePrice, premiumPrice } = req.body;

    // Find the show and add a new ticket type
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    show.ticketTypes.push({ type, basePrice, premiumPrice });

    // Save the updated show
    await show.save();

    res.status(200).json({ message: 'Ticket type added successfully', show });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// Update a ticket type in a show
export const updateTicketTypeInShow = async (req, res) => {
  try {
    const { showId, ticketTypeId } = req.params;
    const { type, basePrice, premiumPrice } = req.body;

    // Find the show and the ticket type to update
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    const ticketType = show.ticketTypes.id(ticketTypeId);
    if (!ticketType) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }

    // Update the ticket type fields
    ticketType.type = type;
    ticketType.basePrice = basePrice;
    ticketType.premiumPrice = premiumPrice;

    // Save the updated show
    await show.save();

    res.status(200).json({ message: 'Ticket type updated successfully', show });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// Delete a ticket type from a show
export const deleteTicketTypeFromShow = async (req, res) => {
  try {
    const { showId, ticketTypeId } = req.params;

    // Find the show and remove the ticket type
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    const ticketType = show.ticketTypes.id(ticketTypeId);
    if (!ticketType) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }

    // Remove the ticket type
    ticketType.remove();

    // Save the updated show
    await show.save();

    res.status(200).json({ message: 'Ticket type deleted successfully', show });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};