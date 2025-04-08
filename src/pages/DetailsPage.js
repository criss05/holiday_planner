import { useState, useEffect } from "react";
import Header from "@/components/UI/Header";
import InputBox from "@/components/UI/DetailsPage/InputBox";
import MiddleInputBox from "@/components/UI/DetailsPage/MiddleInputBox";
import RadioMenu from "@/components/UI/DetailsPage/RadioMenu";
import Calendar from "@/components/UI/DetailsPage/Calendar";
import BackButton from "@/components/UI/DetailsPage/BackButton";
import { FaDownload } from "react-icons/fa";



export default function DetailsPage({ holiday, setIsDetailsPageVisible }) {
    const [holidayDetails, setHolidayDetails] = useState(holiday);
    const [existingArchive, setExistingArchive] = useState([]);
    const [uploadError, setUploadError] = useState(null);


    // Ensure the details are correctly set when the holiday prop changes
    useEffect(() => {
        setHolidayDetails(holiday);
    }, [holiday]);

    useEffect(() => {
        const fetchExistingFiles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${holidayDetails.id}`);

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

        if (holidayDetails?.id) {
            fetchExistingFiles();
        }
    }, [holidayDetails?.id]);

    const handleDownload = async () => {
        try {
            const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${holiday.id}/${holiday.name}/download`;
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `${holiday.id}-files.zip`;
            link.click();

        } catch (error) {
            console.error("Error downloading files:", error);
            alert("Failed to download files. Please try again.");
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
                        <InputBox className="invalid:read-only" value={holidayDetails.name} name="name" />
                    </div>
                </div>

                {/* Destination */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl flex items-center">
                        Where would you like to travel?
                    </label>
                    <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                        <InputBox value={holidayDetails.destination} disabled name="destination" />
                    </div>
                </div>

                {/* Transport Type */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Transport Type:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <div className="grid grid-cols-2 gap-25 items-center">
                            <div className="pl-8">
                                <RadioMenu options={["Car", "Plane", "Train", "Bus", "Ship"]}
                                    value={holidayDetails.transport}
                                    disabled
                                    name="transport" />
                            </div>
                            <MiddleInputBox text="Price" value={holidayDetails.transport_price} disabled />
                        </div>
                    </div>
                </div>

                {/* Travel Dates */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Travel Dates:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <Calendar
                            startDate={holidayDetails.startDate}
                            endDate={holidayDetails.endDate}
                            disabled
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
                                    value={holidayDetails.accommodation}
                                    disabled
                                    name="accommodation" />
                            </div>
                            <div>
                                <MiddleInputBox text="Price" value={holidayDetails.accommodation_price} disabled />
                                <MiddleInputBox text="Name" value={holidayDetails.accommodation_name} disabled />
                                <MiddleInputBox text="Location" value={holidayDetails.accommodation_location} disabled />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Downloads Section */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Downloads:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <div
                            className="flex justify-center items-center mr-4 bg-blue-500 text-white p-3 rounded cursor-pointer h-1"
                            onClick={handleDownload}
                        >
                            <FaDownload />
                        </div>
                        
                        <div>
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
                            {uploadError && (
                                <p className="text-red-600 text-sm">{uploadError}</p>
                            )}
                        </div>
                        
                    </div>

                </div>

                {/* Close Button */}
                <div className="flex justify-start gap-10 pt-4">
                    <BackButton onClick={() => setIsDetailsPageVisible(false)} />
                </div>
            </div>
        </div>
    );
}
