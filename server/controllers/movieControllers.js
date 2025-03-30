import Movie from '../models/movieModel.js'
import { cloudinaryInstance } from '../config/cloudinary.js';


export const getAllMovies = async (req, res, next) => {
    try {
      const MovieList = await Movie.find().select("-duration  -description")
        
      
      res.json({data:MovieList, message: "Movies fetched successfully" });
    } catch (error) {
      
      res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
      console.log(error);
    }
  };
  export const moviesDetails = async (req, res, next) => {
    try { 
      const { movieId } = req.params;
      const movieDetails = await Movie.findById(movieId);
      res.json({ data:  movieDetails, message: "movies deatils fetch sucessfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
      console.log(error);
    }
  };
  
  
  export const createMovie = async (req, res, next) => {
    try {
      const{title,description, genre,releaseDate,language,duration,rating,showtimes} = req.body;
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const cloudinaryRes = await cloudinaryInstance.uploader.upload(req.file.path);
    console.log("Cloudinary Response:", cloudinaryRes);
      const newMovie = new Movie({
        title,
        description,
         genre,
         releaseDate,
         language,
         duration,
         poster:cloudinaryRes.url,
          rating,
          showtimes
          })
       await  newMovie.save();
       console.log('Movie Created:', newMovie); 
      res.json({data:newMovie, message: "movie created sucessfully" });
    } catch (error) {
      
      res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
      console.log(error);
    }
  };

  export const updateMovie = async (req, res) => {
    const { movieId } = req.params;
    const { title, genre, releaseDate, description } = req.body;
    const poster = req.file ? req.file.path : ''; // New poster image if uploaded
    
    try {
      
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      // If a new poster is uploaded, delete the old one (if applicable) from Cloudinary and update the URL
      let posterUrl = movie.poster;
      if (poster) {
        // If there's an old poster, delete it from Cloudinary
        if (posterUrl) {
          const publicId = posterUrl.split('/').pop().split('.')[0]; 
          await cloudinaryInstance.uploader.destroy(publicId); // Delete the old image from Cloudinary
        }
  
        // Upload the new poster to Cloudinary
        const result = await cloudinaryInstance.uploader.upload(poster, { folder: 'movies' });
        posterUrl = result.secure_url; 
      }
      movie.title = title || movie.title;
      movie.genre = genre || movie.genre;
      movie.releaseDate = releaseDate || movie.releaseDate;
      movie.description = description || movie.description;
      movie.poster = posterUrl || movie.poster;
  
      await movie.save(); 
  
      res.status(200).json({ message: 'Movie updated successfully', movie });
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    }
  };
  export const search = async (req, res) => {
    const { genre, title } = req.query; 
    let query = {};
  
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }
  
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
  
    try {
      const movies = await Movie.find(query);
      if (movies.length === 0) {
        return res.status(404).json({ message: 'No movies found matching the criteria' });
      }
      res.status(200).json({ data: movies, message: 'Movies fetched successfully' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    }
  };
 
  export const deactivateMovie = async (req, res) => {
  const { movieId } = req.params; // Get movieId from route parameter

  try {
    // Find the movie by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Deactivate the movie by setting isActive to false
    movie.isActive = false;
    await movie.save(); 

    res.status(200).json({data:movie, message: 'Movie deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

export const deleteMovie = async (req, res) => {
  const { movieId } = req.params; // Get movieId from route parameter

  try {
    // Find the movie by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // If the movie has a poster, delete it from Cloudinary
    if (movie.poster) {
      const publicId = movie.poster.split('/').pop().split('.')[0]; // Extract public ID from URL
      await cloudinaryInstance.uploader.destroy(publicId); // Delete the old image from Cloudinary
    }

    // Delete the movie from the database
    await Movie.deleteOne({ _id: movieId });// Remove the movie from the database

    res.status(200).json({ message: 'Movie deleted successfully' ,data:movie});
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};

  

  