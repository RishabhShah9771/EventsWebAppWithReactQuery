import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ImagePicker from "../ImagePicker.jsx";
import { fetchSelectableImages } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

// EventForm component handles the creation/editing of an event.
// It displays a form with fields for title, image, description, date, time, and location.
// Props:
// - inputData: initial data for the form (used for editing existing events)
// - onSubmit: callback function to handle form submission
// - children: any additional elements (e.g., submit button)
export default function EventForm({ inputData, onSubmit, children }) {
  // State to keep track of the selected image for the event
  const [selectedImage, setSelectedImage] = useState(inputData?.image);

  // Fetch selectable images using React Query
  // - data: array of images
  // - isPending: loading state
  // - isError: error state
  const { data, isPending, isError } = useQuery({
    queryFn: fetchSelectableImages, // Function to fetch images
    queryKey: ["events-images"], // Unique key for caching
  });

  // Handler for selecting an image from the ImagePicker
  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  // Handler for form submission
  function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data into an object
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Call the onSubmit prop with all form data and the selected image
    onSubmit({ ...data, image: selectedImage });
  }

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      {/* Title input field */}
      <p className="control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ""}
        />
      </p>

      {/* Show loading message while images are being fetched */}
      {isPending && <p>Loading Images...</p>}

      {/* Show error block if image fetching fails */}
      {isError && (
        <ErrorBlock
          title="Failed to load image..."
          message="Please try again later..."
        />
      )}

      {/* Show ImagePicker when images are loaded */}
      {data && (
        <div className="control">
          <ImagePicker
            images={data}
            onSelect={handleSelectImage}
            selectedImage={selectedImage}
          />
        </div>
      )}

      {/* Description textarea */}
      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={inputData?.description ?? ""}
        />
      </p>

      {/* Row for date and time inputs */}
      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={inputData?.date ?? ""}
          />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            defaultValue={inputData?.time ?? ""}
          />
        </p>
      </div>

      {/* Location input field */}
      <p className="control">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={inputData?.location ?? ""}
        />
      </p>

      {/* Form actions (e.g., submit button) passed as children */}
      <p className="form-actions">{children}</p>
    </form>
  );
}
