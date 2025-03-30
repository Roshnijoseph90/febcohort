
import {Theater}from '../models/theaterModel.js'; // Import the Theater model
import moment from 'moment';


// CREATE a new theater
export const createTheater = async (req, res) => {
  try {
    const { name, location,shows,showTimes, totalSeats,availableSeats,bookedSeats, facilities,email, contactInfo, status } = req.body;

    const newTheater = new Theater({
      name,
      location,
      shows,
      showTimes,
      totalSeats,
      availableSeats,
      bookedSeats,
      facilities,
      email,
      contactInfo,
      status,
    });

    await newTheater.save();
    res.status(201).json({data:newTheater,message: 'Theater created successfully'});
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// GET all theaters
export const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find()

    if (!theaters ) {
      return res.status(404).json({ message: 'No theaters found' });
    }

    res.status(200).json({ data: theaters, message: 'Theaters fetched successfully' });
  } catch (error) {
    console.error('Error fetching theaters:', error);
    res.status(500).json({ error: 'Failed to fetch theaters', details: error.message });
  }
};
// GET a specific theater by its ID
export const getTheaterById = async (req, res) => {
  const { theaterId } = req.params;

  try {
    const theater = await Theater.findById(theaterId).populate('shows.movieId');

    if (!theater) {
      return res.status(404).json({ error: 'Theater not found' });
    }

    res.status(200).json({data:theater,message:"fetch theater by id"});
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// UPDATE a theater by its ID
export const updateTheater = async (req, res) => {
  const { theaterId } = req.params;
  const updateData = req.body;

  try {
    const updatedTheater = await Theater.findByIdAndUpdate(theaterId, updateData, { new: true });

    if (!updatedTheater) {
      return res.status(404).json({ error: 'Theater not found' });
    }
     

    res.status(200).json({
      message: 'Theater updated successfully',
      theater: updatedTheater,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// DELETE a theater by its ID
export const deleteTheater = async (req, res) => {
  const { theaterId } = req.params;

  try {
    const deletedTheater = await Theater.findByIdAndDelete(theaterId);

    if (!deletedTheater) {
      return res.status(404).json({ error: 'Theater not found' });
    }

    res.status(200).json({data:deletedTheater, message: 'Theater deleted successfully'});
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// ADD a show to a specific theater
export const addShowToTheater = async (req, res) => {
  const { theaterId } = req.params;
  const { movieId, showTimes } = req.body;

  try {
    const theater = await Theater.findById(theaterId);

    if (!theater) {
      return res.status(404).json({ error: 'Theater not found' });
    }

    theater.shows.push({ movieId, showTimes });

    await theater.save();
    res.status(200).json({
      message: 'Show added to theater successfully',
      theater,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

// UPDATE available seats in a specific show
  // You'll need to install moment.js
   
 export const updateShowSeats = async (req, res) => {
  const { theaterId, showId } = req.params;  // Theater and show IDs from the request params
  const { oldTime, newTime, availableSeats, bookedSeats } = req.body;  // oldTime, newTime, availableSeats, bookedSeats from the body

  try {
   
    const theater = await Theater.findById(theaterId);

    if (!theater) {
      return res.status(404).json({ error: 'Theater not found' });
    }

    console.log('Theater found:', theater);
    const show = theater.shows.id(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

   const showTime = show.showTimes.find((showTime) => {
      console.log('Comparing showtime:', showTime.time, 'with', oldTime);
      // Use moment.js to compare the oldTime with showTime.time
      return moment(showTime.time).isSame(moment(oldTime));  
    });

    if (!showTime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    console.log('Showtime found:', showTime);
  showTime.time = moment(newTime).toISOString();  
    showTime.availableSeats = availableSeats; 
    showTime.bookedSeats = bookedSeats; 

   await theater.save();
  res.status(200).json({
      message: 'Showtime updated successfully',
      theater,
    });
  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(500).json({
      error: 'Failed to update showtime',
      details: error.message,
      stack: error.stack,
    });
  }
};
