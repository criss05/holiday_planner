import { useState } from "react";

export default function TransportPrice(){
    return (
        <div className="flex flex-col">
            <label htmlFor="price" className="text-gray-700 font-semibold mb-2">
                Price:
            </label>
            <input
                id="price"
                type="text"
                placeholder="Enter price"
                className="p-2 border-2 border-[#A7CFFF] rounded-md"
            />
        </div>
      );
}