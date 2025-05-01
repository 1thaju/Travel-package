require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const testAdminEndpoints = async () => {
    try {
        // First, login as admin
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@travelpackage.com',
            password: 'Admin@123'
        });

        const token = loginResponse.data.token;
        console.log('\nLogin successful. Token received.');

        // Set up headers with token
        const headers = {
            Authorization: `Bearer ${token}`
        };

        // Test getAllUsersBookings endpoint
        console.log('\nTesting getAllUsersBookings endpoint...');
        const usersBookingsResponse = await axios.get(
            `${API_URL}/bookings/analytics/users`,
            { headers }
        );
        console.log('Users with bookings:', JSON.stringify(usersBookingsResponse.data, null, 2));

        // Test getBookingStats endpoint
        console.log('\nTesting getBookingStats endpoint...');
        const bookingStatsResponse = await axios.get(
            `${API_URL}/bookings/analytics/stats`,
            { headers }
        );
        console.log('Booking statistics:', JSON.stringify(bookingStatsResponse.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
            console.error('Status:', error.response.status);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testAdminEndpoints(); 