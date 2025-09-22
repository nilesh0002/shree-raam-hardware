const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password for Gmail
    },
  });
};

// Send out of stock alert
const sendOutOfStockAlert = async (product) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'URGENT: Product Out of Stock',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">🚨 URGENT: Product Out of Stock</h2>
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px;">
            <h3 style="color: #991b1b; margin-top: 0;">Product Details:</h3>
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>ID:</strong> #${product.id}</p>
            <p><strong>Category:</strong> ${product.category || 'N/A'}</p>
            <p><strong>Price:</strong> $${product.price}</p>
          </div>
          <p style="margin-top: 20px;">
            <strong>Action Required:</strong> Please restock this product immediately to avoid lost sales.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This is an automated alert from your E-commerce Admin System.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Out of stock alert sent for product: ${product.name}`);
  } catch (error) {
    console.error('Failed to send out of stock alert:', error);
  }
};

// Send low stock alert
const sendLowStockAlert = async (products) => {
  try {
    const transporter = createTransporter();
    
    const productList = products.map(p => 
      `<li><strong>${p.name}</strong> - Stock: ${p.stock}</li>`
    ).join('');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Low Stock Alert - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">⚠️ Low Stock Alert</h2>
          <div style="background-color: #fffbeb; border: 1px solid #fed7aa; padding: 20px; border-radius: 8px;">
            <p>The following products are running low on stock (less than 5 units):</p>
            <ul style="margin: 15px 0;">
              ${productList}
            </ul>
          </div>
          <p style="margin-top: 20px;">
            <strong>Recommendation:</strong> Consider restocking these products soon to maintain inventory levels.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This is an automated alert from your E-commerce Admin System.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Low stock alert sent for ${products.length} products`);
  } catch (error) {
    console.error('Failed to send low stock alert:', error);
  }
};

module.exports = { sendOutOfStockAlert, sendLowStockAlert };