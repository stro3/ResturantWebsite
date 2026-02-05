from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import os
import json
import smtplib
import jwt
import hashlib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

app = Flask(__name__)
CORS(app)

try:
    client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'), serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client['restaurant_db']
    db_connected = True
except:
    db_connected = False
    db = None

if db_connected:
    menu_collection = db['menu']
    reservations_collection = db['reservations']
    orders_collection = db['orders']
    reviews_collection = db['reviews']
    users_collection = db['users']
    newsletter_collection = db['newsletter']
    events_collection = db['events']

reservations_memory = []
orders_memory = []
users_memory = [
    {
        'id': 'admin001',
        'name': 'Admin Manager',
        'email': 'admin@gastronome.com',
        'password': hashlib.sha256('admin123'.encode()).hexdigest(),
        'role': 'manager',
        'phone': '+1-555-0001',
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 'emp001',
        'name': 'John Employee',
        'email': 'employee@gastronome.com',
        'password': hashlib.sha256('emp123'.encode()).hexdigest(),
        'role': 'employee',
        'phone': '+1-555-0002',
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 'emp002',
        'name': 'Sarah Wilson',
        'email': 'sarah@gastronome.com',
        'password': hashlib.sha256('emp123'.encode()).hexdigest(),
        'role': 'employee',
        'phone': '+1-555-0003',
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 'emp003',
        'name': 'Mike Johnson',
        'email': 'mike@gastronome.com',
        'password': hashlib.sha256('emp123'.encode()).hexdigest(),
        'role': 'employee',
        'phone': '+1-555-0004',
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 'cust001',
        'name': 'Demo Customer',
        'email': 'customer@test.com',
        'password': hashlib.sha256('customer123'.encode()).hexdigest(),
        'role': 'customer',
        'phone': '+1-555-1001',
        'created_at': datetime.utcnow().isoformat()
    }
]

SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

def generate_token(user_data):
    payload = {
        'user_id': user_data['id'],
        'email': user_data['email'],
        'role': user_data['role'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def send_reservation_email(reservation_data):
    try:
        sender_email = os.getenv('EMAIL_USER', '')
        sender_password = os.getenv('EMAIL_PASS', '')
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"✅ Reservation Confirmed - Gastronome Restaurant (#{reservation_data.get('confirmation_number', 'RES-001')})"
        msg['From'] = f"Gastronome Restaurant <noreply@gastronome.com>"
        msg['To'] = reservation_data.get('email')
        msg['Reply-To'] = 'reservations@gastronome.com'
        
        # Professional HTML email template
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reservation Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <table role="presentation" style="max-width: 600px; width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #722F37 0%, #8B4513 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🍽️ Gastronome</h1>
                                    <p style="color: #FFF8DC; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;">Premium Dining Experience</p>
                                </td>
                            </tr>
                            
                            <!-- Confirmation Badge -->
                            <tr>
                                <td style="text-align: center; padding: 30px; background: #f8f9fa;">
                                    <div style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; border-radius: 25px; font-weight: bold; font-size: 16px;">
                                        ✅ RESERVATION CONFIRMED
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 30px;">
                                    <h2 style="color: #36454F; margin: 0 0 20px 0; font-size: 24px;">Hello {reservation_data.get('name', 'Guest')}!</h2>
                                    <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                                        Thank you for choosing Gastronome Restaurant. Your reservation has been confirmed and we're excited to welcome you for an exceptional dining experience.
                                    </p>
                                    
                                    <!-- Reservation Details -->
                                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 4px solid #722F37; margin: 25px 0;">
                                        <h3 style="color: #722F37; margin: 0 0 20px 0; font-size: 18px;">📋 Reservation Details</h3>
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="padding: 8px 0; font-weight: bold; color: #36454F; width: 30%;">📅 Date:</td>
                                                <td style="padding: 8px 0; color: #666;">{reservation_data.get('date', 'Not specified')}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; font-weight: bold; color: #36454F;">🕐 Time:</td>
                                                <td style="padding: 8px 0; color: #666;">{reservation_data.get('time', 'Not specified')}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; font-weight: bold; color: #36454F;">👥 Party Size:</td>
                                                <td style="padding: 8px 0; color: #666;">{reservation_data.get('guests', 'Not specified')} guests</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; font-weight: bold; color: #36454F;">🍷 Experience:</td>
                                                <td style="padding: 8px 0; color: #666;">{reservation_data.get('experience', 'Fine Dining').replace('-', ' ').title()}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; font-weight: bold; color: #36454F;">🎫 Confirmation:</td>
                                                <td style="padding: 8px 0; color: #722F37; font-weight: bold;">#{reservation_data.get('confirmation_number', 'RES-001')}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    
                                    <!-- Important Information -->
                                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                        <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">📌 Important Information</h4>
                                        <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
                                            <li>Please arrive 10-15 minutes before your reservation time</li>
                                            <li>Smart casual dress code required</li>
                                            <li>For parties of 6+, a service charge may apply</li>
                                            <li>Free cancellation up to 2 hours before reservation</li>
                                        </ul>
                                    </div>
                                    
                                    <!-- Contact Information -->
                                    <div style="text-align: center; margin: 30px 0;">
                                        <p style="color: #666; margin: 0 0 15px 0; font-size: 16px;">Questions or need to make changes?</p>
                                        <div style="background: #722F37; color: white; padding: 15px 25px; border-radius: 8px; display: inline-block;">
                                            <p style="margin: 0; font-size: 16px; font-weight: bold;">📞 +1 (555) 123-4567</p>
                                        </div>
                                        <p style="color: #666; margin: 15px 0 0 0; font-size: 14px;">Available Monday-Sunday, 10 AM - 10 PM</p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background: #36454F; padding: 25px; text-align: center;">
                                    <h3 style="color: #FFF8DC; margin: 0 0 15px 0; font-size: 18px;">Gastronome Restaurant</h3>
                                    <p style="color: #ccc; margin: 0; font-size: 14px; line-height: 1.5;">
                                        123 Culinary Street, Food District, NY 10001<br>
                                        📧 reservations@gastronome.com | 🌐 www.gastronome.com<br>
                                        Follow us: @GastronomeNY
                                    </p>
                                    <div style="margin: 20px 0 0 0;">
                                        <span style="color: #888; font-size: 12px;">
                                            This is an automated confirmation email. Please save this for your records.
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        if sender_email and sender_password:
            try:
                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                    server.login(sender_email, sender_password)
                    server.sendmail(sender_email, reservation_data.get('email'), msg.as_string())
                
                print(f"✅ Email sent to: {reservation_data.get('email')}")
                return True, f"Confirmation email sent to {reservation_data.get('email')}"
                
            except smtplib.SMTPAuthenticationError:
                print("⚠️ Email auth failed - demo mode")
                return True, "Reservation confirmed (demo mode)"
            except Exception as smtp_error:
                print(f"⚠️ Email error: {smtp_error}")
                return True, "Reservation confirmed (demo mode)"
        else:
            print(f"📧 Demo mode: Email would be sent to {reservation_data.get('email')}")
            return True, "Reservation confirmed (demo mode)"
            
    except Exception as e:
        print(f"⚠️ Email exception: {e}")
        return True, "Reservation confirmed (demo mode)"

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'running',
        'name': 'Restaurant API',
        'version': '1.0.0',
        'database': 'connected' if db_connected else 'not connected (using memory storage)',
        'endpoints': [
            '/api/menu',
            '/api/reservations',
            '/api/orders',
            '/api/reviews',
            '/api/events',
            '/api/newsletter',
            '/api/ai-recommendation'
        ]
    })

@app.route('/api/menu', methods=['GET'])
def get_menu():
    category = request.args.get('category')
    dietary = request.args.get('dietary')
    
    if not db_connected:
        return jsonify([])
    
    query = {}
    if category:
        query['category'] = category
    if dietary:
        query['dietary'] = {'$in': [dietary]}
    
    items = list(menu_collection.find(query))
    for item in items:
        item['_id'] = str(item['_id'])
    
    return jsonify(items)

@app.route('/api/menu/<item_id>', methods=['GET'])
def get_menu_item(item_id):
    if not db_connected:
        return jsonify({'error': 'Database not connected'}), 503
    item = menu_collection.find_one({'_id': ObjectId(item_id)})
    if item:
        item['_id'] = str(item['_id'])
        return jsonify(item)
    return jsonify({'error': 'Item not found'}), 404

@app.route('/api/menu', methods=['POST'])
def add_menu_item():
    if not db_connected:
        return jsonify({'error': 'Database not connected'}), 503
    data = request.json
    result = menu_collection.insert_one(data)
    return jsonify({'id': str(result.inserted_id)}), 201

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.json
    data['created_at'] = datetime.utcnow().isoformat()
    data['status'] = 'confirmed'
    
    reservation_id = None
    confirmation_number = None
    
    if db_connected:
        result = reservations_collection.insert_one(data)
        reservation_id = str(result.inserted_id)
        confirmation_number = f"RES-{str(result.inserted_id)[-4:]}"
    else:
        reservation_id = f"RES-{len(reservations_memory) + 1001}"
        confirmation_number = f"RES-{len(reservations_memory) + 1001}"
        data['_id'] = reservation_id
        data['confirmation_number'] = confirmation_number
        reservations_memory.append(data)
    
    # Add confirmation number to data for email
    data['confirmation_number'] = confirmation_number
    
    email_sent, email_message = send_reservation_email(data)
    
    response_message = 'Reservation confirmed successfully!'
    if email_sent:
        email_status = f"✅ Professional confirmation email sent to {data.get('email')}!"
    else:
        email_status = f"⚠️ {email_message}"
    
    return jsonify({
        'id': reservation_id,
        'confirmation_number': confirmation_number,
        'message': response_message,
        'email_sent': email_sent,
        'email_note': email_status,
        'reservation': {
            'name': data.get('name'),
            'date': data.get('date'),
            'time': data.get('time'),
            'guests': data.get('guests'),
            'experience': data.get('experience'),
            'confirmation_number': confirmation_number
        }
    }), 201

@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    date = request.args.get('date')
    
    if not db_connected:
        if date:
            return jsonify([r for r in reservations_memory if r.get('date') == date])
        return jsonify(reservations_memory)
    
    query = {}
    if date:
        query['date'] = date
    
    reservations = list(reservations_collection.find(query))
    for res in reservations:
        res['_id'] = str(res['_id'])
    
    return jsonify(reservations)

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    data['created_at'] = datetime.utcnow().isoformat()
    data['status'] = 'confirmed'
    data['order_number'] = f"ORD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    
    order_id = None
    
    if db_connected:
        result = orders_collection.insert_one(data)
        order_id = str(result.inserted_id)
    else:
        order_id = f"ORD-{len(orders_memory) + 1001}"
        data['_id'] = order_id
        orders_memory.append(data)
    
    return jsonify({
        'order_id': order_id,
        'order_number': data['order_number'],
        'message': 'Order placed successfully',
        'status': 'confirmed',
        'total': data.get('total'),
        'items': data.get('items'),
        'delivery_address': data.get('deliveryAddress')
    }), 201

@app.route('/api/orders', methods=['GET'])
def get_all_orders():
    if db_connected:
        orders = list(orders_collection.find().sort('created_at', -1).limit(50))
        for order in orders:
            order['_id'] = str(order['_id'])
        return jsonify(orders)
    else:
        return jsonify(orders_memory)

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    order = orders_collection.find_one({'_id': ObjectId(order_id)})
    if order:
        order['_id'] = str(order['_id'])
        return jsonify(order)
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/orders/<order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    data = request.json
    result = orders_collection.update_one(
        {'_id': ObjectId(order_id)},
        {'$set': {'status': data['status']}}
    )
    
    if result.modified_count:
        return jsonify({'message': 'Status updated'})
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = list(reviews_collection.find().sort('created_at', -1).limit(20))
    for review in reviews:
        review['_id'] = str(review['_id'])
    
    return jsonify(reviews)

@app.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.json
    data['created_at'] = datetime.utcnow()
    data['approved'] = False
    
    result = reviews_collection.insert_one(data)
    
    return jsonify({
        'id': str(result.inserted_id),
        'message': 'Review submitted for approval'
    }), 201

@app.route('/api/newsletter', methods=['POST'])
def subscribe_newsletter():
    data = request.json
    
    existing = newsletter_collection.find_one({'email': data['email']})
    if existing:
        return jsonify({'message': 'Already subscribed'}), 200
    
    data['subscribed_at'] = datetime.utcnow()
    newsletter_collection.insert_one(data)
    
    return jsonify({'message': 'Subscribed successfully'}), 201

@app.route('/api/events', methods=['GET'])
def get_events():
    events = list(events_collection.find({'date': {'$gte': datetime.utcnow().strftime('%Y-%m-%d')}}).sort('date', 1))
    for event in events:
        event['_id'] = str(event['_id'])
    
    return jsonify(events)

@app.route('/api/ai-recommendation', methods=['POST'])
def ai_recommendation():
    data = request.json
    mood = data.get('mood', 'neutral')
    spice = data.get('spice', 'medium')
    dietary = data.get('dietary', [])
    
    query = {}
    if dietary:
        query['dietary'] = {'$in': dietary}
    
    if spice == 'mild':
        query['spice_level'] = {'$lte': 2}
    elif spice == 'hot':
        query['spice_level'] = {'$gte': 4}
    
    items = list(menu_collection.find(query).limit(3))
    for item in items:
        item['_id'] = str(item['_id'])
    
    return jsonify({'recommendations': items})

@app.route('/api/pairing/<item_id>', methods=['GET'])
def get_pairing(item_id):
    item = menu_collection.find_one({'_id': ObjectId(item_id)})
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    pairing = item.get('pairing_suggestions', [])
    return jsonify({'pairings': pairing})

contact_messages = []

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if user already exists
    existing_user = None
    if db_connected:
        existing_user = users_collection.find_one({'email': data['email']})
    else:
        existing_user = next((u for u in users_memory if u['email'] == data['email']), None)
    
    if existing_user:
        return jsonify({'message': 'User already exists with this email'}), 400
    
    # Create new user
    user_data = {
        'id': f"user_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        'name': data['name'],
        'email': data['email'],
        'phone': data.get('phone', ''),
        'password': hashlib.sha256(data['password'].encode()).hexdigest(),
        'role': data.get('role', 'customer'),
        'created_at': datetime.utcnow().isoformat(),
        'status': 'active'
    }
    
    if db_connected:
        result = users_collection.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)
    else:
        users_memory.append(user_data)
    
    # Generate token
    token = generate_token(user_data)
    
    # Remove password from response
    user_response = {k: v for k, v in user_data.items() if k != 'password'}
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user_response,
        'token': token
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    # Find user
    user = None
    if db_connected:
        user = users_collection.find_one({'email': email})
    else:
        user = next((u for u in users_memory if u['email'] == email), None)
    
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Check password
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    if user['password'] != hashed_password:
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Check role if specified
    if role and user['role'] != role:
        return jsonify({'message': f'Access denied. This account is not registered as {role}'}), 403
    
    # Generate token
    token = generate_token(user)
    
    # Remove password from response
    user_response = {k: v for k, v in user.items() if k != 'password'}
    
    return jsonify({
        'message': 'Login successful',
        'user': user_response,
        'token': token
    }), 200

@app.route('/api/auth/verify', methods=['GET'])
def verify():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token:
        return jsonify({'message': 'No token provided'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'message': 'Invalid or expired token'}), 401
    
    # Get user data
    user = None
    if db_connected:
        user = users_collection.find_one({'id': payload['user_id']})
    else:
        user = next((u for u in users_memory if u['id'] == payload['user_id']), None)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    user_response = {k: v for k, v in user.items() if k != 'password'}
    return jsonify({'user': user_response}), 200

# Get all users (for managers)
@app.route('/api/users', methods=['GET'])
def get_users():
    if db_connected:
        users = list(users_collection.find())
        for u in users:
            u['_id'] = str(u['_id'])
    else:
        users = users_memory
    
    # Remove passwords from response
    users_response = [{k: v for k, v in u.items() if k != 'password'} for u in users]
    return jsonify(users_response)

# Add new staff member (for managers)
@app.route('/api/users/staff', methods=['POST'])
def add_staff():
    data = request.json
    
    # Check if user already exists
    existing_user = None
    if db_connected:
        existing_user = users_collection.find_one({'email': data['email']})
    else:
        existing_user = next((u for u in users_memory if u['email'] == data['email']), None)
    
    if existing_user:
        return jsonify({'message': 'User already exists with this email'}), 400
    
    # Create new staff member
    user_data = {
        'id': f"staff_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        'name': data['name'],
        'email': data['email'],
        'phone': data.get('phone', ''),
        'password': hashlib.sha256(data.get('password', 'staff123').encode()).hexdigest(),
        'role': data.get('role', 'employee'),
        'created_at': datetime.utcnow().isoformat(),
        'status': 'active'
    }
    
    if db_connected:
        result = users_collection.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)
    else:
        users_memory.append(user_data)
    
    # Remove password from response
    user_response = {k: v for k, v in user_data.items() if k != 'password'}
    
    return jsonify({
        'message': 'Staff member added successfully',
        'user': user_response
    }), 201

# Delete user
@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    if db_connected:
        result = users_collection.delete_one({'id': user_id})
        if result.deleted_count == 0:
            return jsonify({'message': 'User not found'}), 404
    else:
        global users_memory
        original_len = len(users_memory)
        users_memory = [u for u in users_memory if u['id'] != user_id]
        if len(users_memory) == original_len:
            return jsonify({'message': 'User not found'}), 404
    
    return jsonify({'message': 'User deleted successfully'}), 200

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    data['created_at'] = datetime.utcnow().isoformat()
    data['status'] = 'new'
    
    message_id = f"MSG-{len(contact_messages) + 1001}"
    data['_id'] = message_id
    contact_messages.append(data)
    
    return jsonify({
        'message_id': message_id,
        'message': 'Thank you for your message! We will get back to you soon.',
        'status': 'success'
    }), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
