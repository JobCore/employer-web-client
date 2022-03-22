# #! /usr/bin/env python3.6
# """
# Python 3.6 or newer required.
# """
# import json
# import os
# import stripe

# # This is your test secret API key.
# stripe.api_key = 'sk_test_1TXcRvV5Nw6YkHAUV2pmZU2J00vnmMWTZu'

# from flask import Flask, render_template, jsonify, request


# app = Flask(__name__, static_folder='public',
#             static_url_path='', template_folder='public')


# def calculate_order_amount(items):
#     # Replace this constant with a calculation of the order's amount
#     # Calculate the order total on the server to prevent
#     # people from directly manipulating the amount on the client
#     return 1400


# @app.route('/create-payment-intent', methods=['POST'])
# def create_payment():
#     try:
#         data = json.loads(request.data)
#         # Create a PaymentIntent with the order amount and currency
#         intent = stripe.PaymentIntent.create(
#             amount=calculate_order_amount(data['items']),
#             currency='eur',
#             automatic_payment_methods={
#                 'enabled': True,
#             },
#         )
#         return jsonify({
#             'clientSecret': intent['client_secret']
#         })
#     except Exception as e:
#         return jsonify(error=str(e)), 403
# if __name__ == '__main__':
#     app.run(port=4242)