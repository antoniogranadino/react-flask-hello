"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def create_user():
    body= request.json

    email= body.get('email', None)
    password= body.get('password', None)

    if email is None or password is None:
        return jsonify({'Error':'email and password are required'}),400
    
    hashed_password = current_app.bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(email=email, password=hashed_password, is_active=True)

    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({"msg":"User created"}),200
    except Exception as error:
        db.session.rollback()
        return jsonify({'msg':'An error ocurred'}),500


@api.route('/login', methods=['POST'])
def user_login():
    body=request.json

    email= body.get("email", None)
    password= body.get("password", None)

    if email is None or password is None:
        return jsonify({'Error':'email and password required'}),400
    
    user = User.query.filter_by(email=email).one_or_none()

    if user is None:
        return jsonify({"error":"user not found"}), 404
    
    password_match = current_app.bcrypt.check_password_hash(user.password, password)

    if not password_match:
        return jsonify({"error":"password incorrect"}),400
    
    user_token = create_access_token({"id":user.id, "email":user.email})
    return jsonify({"user": user.serialize(), "token":user_token}),200

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    email= get_jwt_identity()['email']
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error":"user not found"}), 404
    
    return jsonify({"user": user.serialize()}),200


