const Packages = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Travel Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Package cards will be added here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            KERALA
          </h2>
          <p className="text-gray-600 mb-4">
            Experience an amazing journey with our carefully curated package.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">$999</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View Details
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            DELHI+MANALI
          </h2>
          <p className="text-gray-600 mb-4">
            Experience an amazing journey with our carefully curated package.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">$999</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages; 