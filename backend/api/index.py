from backend.create_app import create_app  # Import your create_app function

app = create_app()  # Initialize the Flask app

# Vercel handler function
def handler(event, context):
    from mangum import Mangum
    asgi_app = Mangum(app)
    return asgi_app(event, context)
