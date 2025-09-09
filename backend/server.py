from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import urllib.parse
from typing import Optional
import uvicorn

app = FastAPI(title="Varman Constructions API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory="..", html = True), name="static")

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    material: str
    message: str
    project_location: Optional[str] = None

class QuoteRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    materials: list[str]
    quantity: str
    project_details: str
    timeline: Optional[str] = None

def send_email_notification(form_data: dict, form_type: str):
    """Send email notification to admin"""
    try:
        # Email configuration
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = os.getenv("EMAIL_USER", "")
        sender_password = os.getenv("EMAIL_PASSWORD", "")
        admin_email = os.getenv("ADMIN_EMAIL", "info@varmanconstructions.in")
        
        if not sender_email or not sender_password:
            print("Email credentials not configured")
            return False
            
        # Create message
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = admin_email
        msg["Subject"] = f"New {form_type} from Varman Constructions Website"
        
        # Email body
        body = f"""
        New {form_type} received from website:
        
        Name: {form_data.get('name', 'N/A')}
        Email: {form_data.get('email', 'N/A')}
        Phone: {form_data.get('phone', 'N/A')}
        
        """
        
        if form_type == "Contact Form":
            body += f"""
        Material Interest: {form_data.get('material', 'N/A')}
        Message: {form_data.get('message', 'N/A')}
        Project Location: {form_data.get('project_location', 'N/A')}
            """
        else:  # Quote Request
            body += f"""
        Materials: {', '.join(form_data.get('materials', []))}
        Quantity: {form_data.get('quantity', 'N/A')}
        Project Details: {form_data.get('project_details', 'N/A')}
        Timeline: {form_data.get('timeline', 'N/A')}
            """
        
        body += f"""
        
        Please contact them at: {form_data.get('phone', 'N/A')}
        
        Best regards,
        Varman Constructions Website
        """
        
        msg.attach(MIMEText(body, "plain"))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def generate_whatsapp_url(form_data: dict, form_type: str):
    """Generate WhatsApp URL with pre-filled message"""
    admin_whatsapp = "+917708484811"  # Primary business number
    
    if form_type == "Contact Form":
        message = f"""Hello Varman Constructions!

I'm interested in your building materials.

*My Details:*
Name: {form_data.get('name', '')}
Email: {form_data.get('email', '')}
Phone: {form_data.get('phone', '')}
Material Interest: {form_data.get('material', '')}

*Message:*
{form_data.get('message', '')}

Project Location: {form_data.get('project_location', 'Not specified')}

Please provide more information and quotation.

Thank you!"""
    else:  # Quote Request
        materials_list = ', '.join(form_data.get('materials', []))
        message = f"""Hello Varman Constructions!

I need a quotation for building materials.

*My Details:*
Name: {form_data.get('name', '')}
Email: {form_data.get('email', '')}
Phone: {form_data.get('phone', '')}

*Requirements:*
Materials: {materials_list}
Quantity: {form_data.get('quantity', '')}
Timeline: {form_data.get('timeline', 'Not specified')}

*Project Details:*
{form_data.get('project_details', '')}

Please send me detailed quotation with pricing and delivery information.

Thank you!"""
    
    encoded_message = urllib.parse.quote(message)
    whatsapp_url = f"https://wa.me/{admin_whatsapp.replace('+', '')}?text={encoded_message}"
    
    return whatsapp_url

@app.post("/api/contact")
async def submit_contact_form(form_data: ContactForm):
    """Handle contact form submission"""
    try:
        # Convert to dict
        data_dict = form_data.dict()
        
        # Send email notification
        email_sent = send_email_notification(data_dict, "Contact Form")
        
        # Generate WhatsApp URL
        whatsapp_url = generate_whatsapp_url(data_dict, "Contact Form")
        
        return {
            "success": True,
            "message": "Thank you for your inquiry! We'll contact you within 24 hours.",
            "whatsapp_url": whatsapp_url,
            "email_sent": email_sent
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.post("/api/quote")
async def submit_quote_request(quote_data: QuoteRequest):
    """Handle quote request submission"""
    try:
        # Convert to dict
        data_dict = quote_data.dict()
        
        # Send email notification
        email_sent = send_email_notification(data_dict, "Quote Request")
        
        # Generate WhatsApp URL
        whatsapp_url = generate_whatsapp_url(data_dict, "Quote Request")
        
        return {
            "success": True,
            "message": "Quote request submitted! We'll send you detailed pricing within 24 hours.",
            "whatsapp_url": whatsapp_url,
            "email_sent": email_sent
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/api/products")
async def get_products():
    """Get all products with detailed specifications"""
    products = {
        "m_sand": {
            "name": "M-Sand (Manufactured Sand)",
            "description": "High-quality manufactured sand for construction",
            "specifications": {
                "fineness_modulus": "2.6 - 3.0",
                "silt_content": "< 3%",
                "water_absorption": "< 2%",
                "bulk_density": "1.75 - 1.85 kg/m³"
            },
            "uses": ["Concrete mixing", "Plastering", "Block work", "Foundation"],
            "advantages": ["Consistent quality", "No impurities", "Better workability", "Environmentally friendly"],
            "unit": "per cubic meter",
            "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"
        },
        "p_sand": {
            "name": "P-Sand (Plastering Sand)",
            "description": "Fine sand specially processed for plastering work",
            "specifications": {
                "particle_size": "0.15mm - 2mm",
                "silt_content": "< 2%",
                "clay_content": "< 1%",
                "fineness_modulus": "1.5 - 2.5"
            },
            "uses": ["Wall plastering", "Ceiling work", "Finishing work", "Tile fixing"],
            "advantages": ["Smooth finish", "Easy workability", "No cracking", "Better adhesion"],
            "unit": "per cubic meter",
            "image": "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80"
        },
        "blue_metal": {
            "name": "Blue Metal / Jalli",
            "description": "Crushed stone aggregates in various sizes",
            "sizes": {
                "6mm": {
                    "description": "Fine aggregate for concrete",
                    "uses": ["RCC work", "Concrete blocks", "Precast elements", "Fine concrete work"],
                    "specifications": "6mm down aggregate, angular shape"
                },
                "10mm": {
                    "description": "Standard aggregate for concrete",
                    "uses": ["Structural concrete", "Column concrete", "Beam concrete", "General RCC work"],
                    "specifications": "10mm down aggregate, cubical shape"
                },
                "12mm": {
                    "description": "Medium aggregate for construction",
                    "uses": ["Slab concrete", "Foundation concrete", "Road construction", "Drainage work"],
                    "specifications": "12mm down aggregate, well graded"
                },
                "20mm": {
                    "description": "Coarse aggregate for heavy construction",
                    "uses": ["Heavy concrete work", "Dam construction", "Bridge construction", "Industrial flooring"],
                    "specifications": "20mm down aggregate, high strength"
                },
                "40mm": {
                    "description": "Large aggregate for mass concrete",
                    "uses": ["Mass concrete", "Dam construction", "Large foundations", "Infrastructure projects"],
                    "specifications": "40mm down aggregate, maximum size"
                }
            },
            "properties": {
                "crushing_strength": "> 200 N/mm²",
                "water_absorption": "< 1%",
                "impact_value": "< 10%",
                "specific_gravity": "2.6 - 2.8"
            },
            "unit": "per cubic meter",
            "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80"
        },
        "red_bricks": {
            "name": "Red Bricks",
            "description": "Traditional clay bricks for construction",
            "types": {
                "first_class": {
                    "description": "Premium quality red bricks",
                    "specifications": "Size: 230x110x75mm, Strength: >3.5 N/mm²",
                    "uses": ["Load bearing walls", "Structural work", "Premium construction"]
                },
                "second_class": {
                    "description": "Standard quality red bricks", 
                    "specifications": "Size: 230x110x75mm, Strength: 3.5 N/mm²",
                    "uses": ["Non-load bearing walls", "Partition walls", "General construction"]
                }
            },
            "properties": {
                "compressive_strength": "3.5 - 7 N/mm²",
                "water_absorption": "15-20%",
                "size_tolerance": "±3mm",
                "thermal_conductivity": "0.6-1.0 W/mK"
            },
            "unit": "per 1000 nos",
            "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
        },
        "fly_ash_bricks": {
            "name": "Fly Ash Bricks",
            "description": "Eco-friendly bricks made from fly ash and cement",
            "specifications": {
                "size": "230x110x75mm",
                "compressive_strength": "7.5 - 10 N/mm²",
                "water_absorption": "10-15%",
                "density": "1800-2000 kg/m³"
            },
            "uses": ["Load bearing walls", "High-rise construction", "Earthquake resistant construction", "Thermal insulation"],
            "advantages": ["Higher strength", "Lower weight", "Better thermal insulation", "Eco-friendly"],
            "unit": "per 1000 nos",
            "image": "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=800&q=80"
        },
        "concrete_blocks": {
            "name": "Concrete Hollow Blocks",
            "description": "Precast concrete blocks for quick construction",
            "specifications": {
                "sizes": ["200x200x400mm", "150x200x400mm", "100x200x400mm"],
                "compressive_strength": "> 4 N/mm²",
                "density": "1500-1800 kg/m³",
                "wall_thickness": "20-30mm"
            },
            "uses": ["Partition walls", "Compound walls", "Non-load bearing walls", "Quick construction"],
            "advantages": ["Fast construction", "Good insulation", "Uniform size", "Cost effective"],
            "unit": "per nos",
            "image": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80"
        },
        "cement": {
            "name": "Cement",
            "description": "Portland cement for all construction needs",
            "grades": {
                "opc_43": {
                    "description": "Ordinary Portland Cement Grade 43",
                    "strength": "43 N/mm² at 28 days",
                    "uses": ["General construction", "Plastering", "Non-structural work"]
                },
                "opc_53": {
                    "description": "Ordinary Portland Cement Grade 53", 
                    "strength": "53 N/mm² at 28 days",
                    "uses": ["Structural work", "High strength concrete", "Precast elements"]
                },
                "ppc": {
                    "description": "Portland Pozzolana Cement",
                    "strength": "33 N/mm² at 28 days",
                    "uses": ["Mass concrete", "Marine construction", "Sewerage work"]
                }
            },
            "brands": ["UltraTech", "ACC", "Ambuja", "JK Lakshmi", "Birla A1"],
            "packaging": "50 kg bags",
            "unit": "per bag",
            "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
        },
        "aac_blocks": {
            "name": "AAC Blocks",
            "description": "Autoclaved Aerated Concrete blocks",
            "specifications": {
                "sizes": ["600x200x100mm", "600x200x150mm", "600x200x200mm"],
                "density": "550-650 kg/m³", 
                "compressive_strength": "3-4.5 N/mm²",
                "thermal_conductivity": "0.16-0.18 W/mK"
            },
            "uses": ["Load bearing walls", "Partition walls", "Thermal insulation", "Sound insulation"],
            "advantages": ["Lightweight", "Excellent insulation", "Fire resistant", "Earthquake resistant"],
            "unit": "per cubic meter",
            "image": "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80"
        },
        "size_stone": {
            "name": "Size Stone",
            "description": "Cut-to-size natural stones for construction",
            "types": {
                "granite": {
                    "description": "High strength granite stones",
                    "uses": ["Flooring", "Cladding", "Monuments", "Heavy construction"],
                    "sizes": "Custom sizes available"
                },
                "sandstone": {
                    "description": "Natural sandstone blocks",
                    "uses": ["Wall cladding", "Landscaping", "Decorative work"],
                    "sizes": "Standard and custom sizes"
                }
            },
            "specifications": {
                "compressive_strength": "> 100 N/mm²",
                "water_absorption": "< 0.5%",
                "finishes": ["Natural", "Polished", "Flamed", "Shot blasted"]
            },
            "unit": "per square meter / cubic meter",
            "image": "https://images.unsplash.com/photo-1568205284717-cfb9fa4554e4?auto=format&fit=crop&w=800&q=80"
        },
        "natural_stone": {
            "name": "Natural Stone Aggregates", 
            "description": "Natural stone materials for various construction needs",
            "types": {
                "rubble": {
                    "description": "Irregular shaped natural stones",
                    "uses": ["Foundation work", "Retaining walls", "Landscaping"],
                    "sizes": "50-300mm random sizes"
                },
                "boulder": {
                    "description": "Large natural stone pieces",
                    "uses": ["Coastal protection", "Landscaping", "Decorative work"],
                    "sizes": "300mm and above"
                }
            },
            "unit": "per cubic meter",
            "image": "https://images.unsplash.com/photo-1516906080664-25d1f1bb4d32?auto=format&fit=crop&w=800&q=80"
        }
    }
    
    return {"products": products}

@app.get("/api/faqs")
async def get_faqs():
    """Get frequently asked questions"""
    faqs = [
        {
            "category": "Delivery",
            "questions": [
                {
                    "question": "What is your delivery time?",
                    "answer": "We deliver within 24-48 hours for most materials within our service areas. For large orders, delivery is typically within 2-3 days."
                },
                {
                    "question": "Do you deliver to all areas?",
                    "answer": "Yes, we deliver across Tamil Nadu and nearby states. Delivery charges may apply based on distance."
                },
                {
                    "question": "Is there a minimum order quantity?",
                    "answer": "Minimum order varies by material: M-Sand (5 cubic meters), Bricks (5000 nos), Blue Metal (3 cubic meters). Contact us for specific requirements."
                }
            ]
        },
        {
            "category": "Payment",
            "questions": [
                {
                    "question": "What payment methods do you accept?",
                    "answer": "We accept cash, bank transfer, cheque, and digital payments (GPay, PhonePe, Paytm). Credit terms available for regular customers."
                },
                {
                    "question": "Do you offer credit terms?",
                    "answer": "Yes, we offer credit terms for established contractors and repeat customers after verification."
                }
            ]
        },
        {
            "category": "Quality",
            "questions": [
                {
                    "question": "Are your materials tested?",
                    "answer": "Yes, all our materials undergo quality testing and meet IS standards. We provide test certificates on request."
                },
                {
                    "question": "Do you provide material certificates?",
                    "answer": "Yes, we provide quality certificates and test reports for all major materials like cement, steel, and aggregates."
                }
            ]
        },
        {
            "category": "Pricing",
            "questions": [
                {
                    "question": "How is pricing determined?",
                    "answer": "Pricing depends on material type, quantity, delivery location, and current market rates. Contact us for latest quotations."
                },
                {
                    "question": "Do you offer bulk discounts?",
                    "answer": "Yes, we offer attractive discounts for bulk orders. Larger the quantity, better the rates."
                }
            ]
        }
    ]
    
    return {"faqs": faqs}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
