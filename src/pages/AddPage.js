import HeaderAdd from "@/components/UI/AddPage/HeaderAdd"
import InformationFields from "@/components/UI/AddPage/InformationFields";
import { FaMapMarkedAlt } from "react-icons/fa";
import DoneButton from "@/components/UI/AddPage/DoneButton";
import CancelButton from "@/components/UI/AddPage/CancelButton";


export default function AddPage() {
    return (
        <div className="min-h-screen">
            <HeaderAdd />
            <div className="w-3/5 flex flex-col justify-between p-20">
                <InformationFields text="Holiday Name" />
                <InformationFields text="Where would you like to travel?" icon={<FaMapMarkedAlt />} />
                <InformationFields text="What type of transport would you like to use?" />
                <InformationFields text="When would you like to travel?" />
                <InformationFields text="What is the type of accommodation you would prefer?" />
                <div className="flex justify-left gap-20">
                    <DoneButton />
                    <CancelButton />
                </div>
            </div>


        </div>
    );
}