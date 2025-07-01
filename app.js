// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Routers
const authRoutes = require('./Router/router');
const productRoutes = require('./Router/productRoutes');
const brokerRoutes = require('./Router/brokerRouter');
const buyerRoutes = require('./Router/buyerRoutes');
const containerRoutes = require('./Router/containerRoutes');
const sellerRoutes = require('./Router/sellerRoutes'); 
const shipperRoutes = require('./Router/shipperRoutes')
const farmerRoutes = require('./Router/farmerRoutes')
const countryRoutes = require("./Router/countryRoutes");
const packerRoutes = require("./Router/packerRoutes");
const portRoutes = require("./Router/portRouter");
const freightForwarderRoutes = require("./Router/freightForwarderRoutes")
const uniqueIdRoutes= require("./Router/uniqueIdRoutes");
const buyerContractRoutes = require("./Router/buyercontractRoutes");
const farmerContractRoutes = require("./Router/farmercontractRoutes");
const sellerContractRoutes = require("./Router/sellercontractRouter")
const priceCalculatorRoutes = require("./Router/priceCalculatorRoutes");
const shipmentBooking = require('./Router/shipmentBookingRouter');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectionString = "mongodb+srv://aryaPulses:PT5fL31C6t0mvswQ@aryapulses.idiiy39.mongodb.net/arya_pulses?retryWrites=true&w=majority";
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
mongoose.connection.once("open", () => {
  console.log(`✅ Connected to DB: ${mongoose.connection.name}`);
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/shippers', shipperRoutes);
app.use("/api/farmers", farmerRoutes);
app.use('/api/country',countryRoutes);
app.use("/api/packers", packerRoutes);
app.use("/api/ports", portRoutes);
app.use("/api/freightforwarder", freightForwarderRoutes);
app.use("/api/uniqueid", uniqueIdRoutes);
app.use("/api/buyercontracts", buyerContractRoutes);
app.use("/api/farmercontracts", farmerContractRoutes);
app.use("/api/sellercontracts", sellerContractRoutes);
app.use("/api/calculation",priceCalculatorRoutes);
app.use("/api/shipmentbooking", shipmentBooking)

// Test route
app.get('/api/test', (req, res) => {
  res.send('API is live');
});



// ──────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────-

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
