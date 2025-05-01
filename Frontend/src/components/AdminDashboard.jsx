import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        from: '',
        to: '',
        startDate: '',
        endDate: '',
        basePrice: '',
        maxCapacity: '',
        description: '',
        includedServices: {
            food: {
                available: false,
                pricePerDay: 0
            },
            accommodation: {
                available: false,
                pricePerDay: 0
            }
        }
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axios.get('/api/travel-packages');
            setPackages(response.data.data);
        } catch (err) {
            setError('Failed to fetch packages');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('includedServices')) {
            const [service, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                includedServices: {
                    ...prev.includedServices,
                    [service.split('[')[1].split(']')[0]]: {
                        ...prev.includedServices[service.split('[')[1].split(']')[0]],
                        [field]: type === 'checkbox' ? checked : Number(value)
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/api/travel-packages/${selectedPackage._id}`, formData);
            } else {
                await axios.post('/api/travel-packages', formData);
            }
            fetchPackages();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save package');
        }
    };

    const handleEdit = (pkg) => {
        setSelectedPackage(pkg);
        setFormData({
            from: pkg.from,
            to: pkg.to,
            startDate: new Date(pkg.startDate).toISOString().split('T')[0],
            endDate: new Date(pkg.endDate).toISOString().split('T')[0],
            basePrice: pkg.basePrice,
            maxCapacity: pkg.maxCapacity,
            description: pkg.description,
            includedServices: pkg.includedServices
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            try {
                await axios.delete(`/api/travel-packages/${id}`);
                fetchPackages();
            } catch (err) {
                setError('Failed to delete package');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            from: '',
            to: '',
            startDate: '',
            endDate: '',
            basePrice: '',
            maxCapacity: '',
            description: '',
            includedServices: {
                food: {
                    available: false,
                    pricePerDay: 0
                },
                accommodation: {
                    available: false,
                    pricePerDay: 0
                }
            }
        });
        setSelectedPackage(null);
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Welcome, {user?.name}</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Package Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        {isEditing ? 'Edit Package' : 'Add New Package'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">From</label>
                                <input
                                    type="text"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">To</label>
                                <input
                                    type="text"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Base Price</label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                                <input
                                    type="number"
                                    name="maxCapacity"
                                    value={formData.maxCapacity}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        {/* Included Services */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Included Services</h3>
                            
                            {/* Food Service */}
                            <div className="border p-4 rounded">
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name="includedServices[food].available"
                                        checked={formData.includedServices.food.available}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">Food Service Available</label>
                                </div>
                                {formData.includedServices.food.available && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price per Day</label>
                                        <input
                                            type="number"
                                            name="includedServices[food].pricePerDay"
                                            value={formData.includedServices.food.pricePerDay}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Accommodation Service */}
                            <div className="border p-4 rounded">
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name="includedServices[accommodation].available"
                                        checked={formData.includedServices.accommodation.available}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">Accommodation Available</label>
                                </div>
                                {formData.includedServices.accommodation.available && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price per Day</label>
                                        <input
                                            type="number"
                                            name="includedServices[accommodation].pricePerDay"
                                            value={formData.includedServices.accommodation.pricePerDay}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isEditing ? 'Update Package' : 'Create Package'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Packages Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Travel Packages</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From - To</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {packages.map((pkg) => (
                                    <tr key={pkg._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{pkg.from}</div>
                                            <div className="text-sm text-gray-500">{pkg.to}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(pkg.startDate).toLocaleDateString()} -
                                                {new Date(pkg.endDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${pkg.basePrice}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(pkg)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pkg._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 