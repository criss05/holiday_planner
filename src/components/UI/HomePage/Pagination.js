export default function Pagination({currentPage, totalPages, setCurrentPage}){
    return (
        <div className="p-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className={
              "text-sm px-4 py-2 font-bold text-black " +
              (currentPage <= 1 ? "text-gray-500" : "cursor-pointer  text-black")
            }
          >
            Previous
          </button>
    
          {/* Page Counter */}
          <span className="text-base font-semibold text-black">
            Page {currentPage}/{totalPages}
          </span>
    
          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={
              "text-sm px-4 py-2 font-bold text-black " +
              (currentPage === totalPages ? "text-gray-500" : "cursor-pointer  text-black")
            }
          >
            Next
          </button>
        </div>
      );
}