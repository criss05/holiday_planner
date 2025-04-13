import { useState, useEffect } from "react";
import Header from "@/components/UI/Header";
import InputBox from "@/components/UI/Add&EditPage/InputBox";
import MiddleInputBox from "@/components/UI/Add&EditPage/MiddleInputBox";
import RadioMenu from "@/components/UI/Add&EditPage/RadioMenu";
import Calendar from "@/components/UI/Add&EditPage/Calendar";
import DoneButton from "@/components/UI/Add&EditPage/DoneButton";
import CancelButton from "@/components/UI/Add&EditPage/CancelButton";
import { FaMapMarkedAlt, FaUpload } from "react-icons/fa";

export default function EditPage({ holiday, setIsEditPageVisible, handleUpdateHoliday }) {
    const [editedHoliday, setEditedHoliday] = useState(holiday);
    const [uploadedFile, setUploadedFile] = useState([]);
    const [uploadError, setUploadError] = useState(null);
    const [existingArchive, setExistingArchive] = useState([]);


    const updateHoliday = (field, value) => {
        setEditedHoliday((prev) => ({
            ...prev,
            [field]: value
        }));
    };


    const isValidPrice = (price) => {
        return /^\d+(\.\d{1,2})?$/.test(price);
    };

    const validateForm = () => {
        const {
            holiday_name,
            holiday_destination,
            holiday_start_date,
            holiday_end_date,
            holiday_transport,
            holiday_transport_price,
            holiday_accommodation,
            holiday_accommodation_name,
            holiday_accommodation_price,
            holiday_accommodation_location,
        } = editedHoliday;

        if (!holiday_name || !holiday_destination || !holiday_start_date || !holiday_end_date || !holiday_transport || !holiday_accommodation || !holiday_accommodation_name || !holiday_accommodation_location) {
            alert("All fields must be filled out.");
            return false;
        }

        if (!isValidPrice(holiday_transport_price) || !isValidPrice(holiday_accommodation_price)) {
            alert("Price fields must be valid numbers.");
            return false;
        }

        if (new Date(holiday_start_date) - new Date(holiday_end_date) > 0) {
            alert("End date cannot be before the start date");
            return false;
        }

        return true;
    };

    useEffect(() => {
        const fetchExistingFiles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${editedHoliday.holiday_id}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch files");
                }

                const data = await response.json();
                setExistingArchive(data.files);

            } catch (error) {
                console.error("Error fetching existing files:", error);
                setUploadError("Failed to load existing files. Please try again.");
            }
        };

        if (editedHoliday?.holiday_id) {
            fetchExistingFiles();
        }
    }, [editedHoliday?.holiday_id]);


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);  // Convert FileList to an array
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mkv", ".avi", ".mov"];

        const invalidFiles = files.filter(file => {
            const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
            return !allowedExtensions.includes(ext);
        });

        if (invalidFiles.length > 0) {
            setUploadError("Only image and video files are allowed.");
            setUploadedFile([]);
            return;
        }

        setUploadError(null);
        setUploadedFile(files);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
    
        // Try uploading files first
        if (uploadedFile.length > 0) {
            const success = await uploadFiles();
            if (!success) {
                // Save form with upload error too
                savePendingEditLocally();
                alert("Upload failed. Your changes have been saved locally and will sync once online.");
                return;
            }
        }
    
        try {
            await handleUpdateHoliday(
                editedHoliday.holiday_id,
                editedHoliday.holiday_name,
                editedHoliday.holiday_destination,
                editedHoliday.holiday_start_date,
                editedHoliday.holiday_end_date,
                editedHoliday.holiday_transport,
                editedHoliday.holiday_transport_price,
                editedHoliday.holiday_accommodation,
                editedHoliday.holiday_accommodation_name,
                editedHoliday.holiday_accommodation_price,
                editedHoliday.holiday_accommodation_location
            );
        } catch (error) {
            console.warn("Failed to update holiday:", error);
            savePendingEditLocally();
            alert("Server error! Your changes are saved locally and will be retried when you're back online.");
        }
    };
    
    const savePendingEditLocally = () => {
        const pendingEdits = JSON.parse(localStorage.getItem("pendingEdits")) || [];
    
        const updatedEdits = pendingEdits.filter(edit => edit.holiday_id !== editedHoliday.holiday_id); // Avoid duplicates
    
        updatedEdits.push(editedHoliday);
        localStorage.setItem("pendingEdits", JSON.stringify(updatedEdits));
    };

    const uploadFiles = async () => {
        if (uploadedFile.length === 0) {
            setUploadError("Please select files before submitting.");
            return false;
        }

        const formData = new FormData();
        uploadedFile.forEach(file => {
            formData.append("files", file);
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${editedHoliday.holiday_id}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "File upload failed");
            }

            const data = await response.json();
            console.log("Upload success:", data);

            // Update local state to reflect the new uploaded files
            setExistingArchive(data.archives);
            return true;
        } catch (error) {
            console.error("Upload error:", error);
            setUploadError(error.message);
            return false;
        }
    };


    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex flex-col p-20 space-y-10">
                {/* Holiday Name */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Holiday Name:</label>
                    <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                        <InputBox value={editedHoliday.holiday_name}
                            onChange={(value) => updateHoliday("holiday_name", value)}
                            name="holiday_name"
                        />
                    </div>
                </div>

                {/* Destination */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl flex items-center">
                        Where would you like to travel?
                    </label>
                    <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                        <FaMapMarkedAlt className="mr-2 text-2xl" />
                        <InputBox value={editedHoliday.holiday_destination}
                            onChange={(value) => updateHoliday("holiday_destination", value)}
                            name="holiday_destination"
                        />
                    </div>
                </div>

                {/* Transport Type */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Transport Type:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <div className="grid grid-cols-2 gap-25 items-center">
                            <div className="pl-8">
                                <RadioMenu options={["Car", "Plane", "Train", "Bus", "Ship"]}
                                    value={editedHoliday.holiday_transport}
                                    onChange={(value) => updateHoliday("holiday_transport", value)}
                                    name="holiday_transport" />
                            </div>
                            <MiddleInputBox text="Price"
                                value={editedHoliday.holiday_transport_price}
                                onChange={(e) => updateHoliday("holiday_transport_price", e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Travel Dates */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Travel Dates:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <Calendar
                            holiday_start_date={editedHoliday.holiday_start_date}
                            holiday_end_date={editedHoliday.holiday_end_date}
                            onChange={(dates) => {
                                updateHoliday("holiday_start_date", dates.holiday_start_date);
                                updateHoliday("holiday_end_date", dates.holiday_end_date);

                            }}
                            minDate={null}
                        />
                    </div>
                </div>

                {/* Accommodation Type */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Accommodation Type:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <div className="grid grid-cols-2 gap-15">
                            <div className="pl-3">
                                <RadioMenu options={["Hotel", "Motel", "Hostel", "Apartment", "Cabin", "Resort", "Villa", "Campsite"]}
                                    value={editedHoliday.holiday_accommodation}
                                    onChange={(value) => updateHoliday("holiday_accommodation", value)}
                                    name="holiday_accommodation" />
                            </div>
                            <div>
                                <MiddleInputBox
                                    text="Price"
                                    value={editedHoliday.holiday_accommodation_price}
                                    onChange={(e) => updateHoliday("holiday_accommodation_price", e.target.value)}
                                />
                                <MiddleInputBox
                                    text="Name"
                                    value={editedHoliday.holiday_accommodation_name}
                                    onChange={(e) => updateHoliday("accommodation_name", e.target.value)}
                                />
                                <MiddleInputBox
                                    text="Location"
                                    value={editedHoliday.holiday_accommodation_location}
                                    onChange={(e) => updateHoliday("holiday_accommodation_location", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>



                {/* Upload files */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Upload Memories:</label>
                    <div className="flex flex-col space-y-2 bg-blue-100 border border-blue-300 px-3 py-2">
                        {/* Display Existing Archives */}
                        {existingArchive.length > 0 && (
                            <div>
                                <h3>Existing Uploaded Files:</h3>
                                <ul>
                                    {existingArchive.map((file, index) => (
                                        <li key={index}>
                                            {file.originalName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <label className="flex items-center cursor-pointer space-x-2 text-blue-700 hover:text-blue-900">
                            <FaUpload className="text-2xl" />
                            <span>{uploadedFile.length > 0 ? "Change Files" : "Upload New Files"}</span>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                            />
                        </label>

                        {uploadedFile.length > 0 && (
                            <div className="text-gray-700 mt-2">
                                <p>Selected Files:</p>
                                <ul>
                                    {uploadedFile.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {uploadError && (
                            <p className="text-red-600 text-sm">{uploadError}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-start gap-10 pt-4">
                    <DoneButton onClick={handleSubmit} />
                    <CancelButton onClick={() => setIsEditPageVisible(false)} />
                </div>
            </div>
        </div>
    );
}
