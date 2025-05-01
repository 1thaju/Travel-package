
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [includeFood, setIncludeFood] = useState(true);
  const [includeAccommodation, setIncludeAccommodation] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/travel-packages/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch package details');
        }

        setPkg(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const calculateTotalPrice = () => {
    if (!pkg) return 0;
    let total = pkg.price;
    if (!includeFood) total -= pkg.foodPrice || 0;
    if (!includeAccommodation) total -= pkg.accommodationPrice || 0;
    return total;
  };

  const handleBooking = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          packageId: id,
          includeFood,
          includeAccommodation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      alert('Booking successful!');
    } catch (err) {
      alert(`Booking failed: ${err.message}`);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading package details...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{pkg.name}</h2>
        <p><strong>From:</strong> {pkg.from}</p>
        <p><strong>To:</strong> {pkg.to}</p>
        <p><strong>Date:</strong> {new Date(pkg.startDate).toLocaleDateString()} to {new Date(pkg.endDate).toLocaleDateString()}</p>
        <p><strong>Base Price:</strong> ${pkg.price}</p>

        <div className="mt-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeFood}
              onChange={() => setIncludeFood(!includeFood)}
              className="mr-2"
            />
            Include Food (${pkg.foodPrice || 0})
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeAccommodation}
              onChange={() => setIncludeAccommodation(!includeAccommodation)}
              className="mr-2"
            />
            Include Accommodation (${pkg.accommodationPrice || 0})
          </label>
        </div>

        <div className="mt-4">
          <p className="text-lg font-semibold">Total Price: ${calculateTotalPrice()}</p>
        </div>

        <button
          onClick={handleBooking}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
