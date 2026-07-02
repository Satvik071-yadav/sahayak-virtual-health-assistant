"""
Seed the database with initial demo data:
- One admin user (admin@vha-health.example / Admin@123)
- Sample doctors
- Sample FAQs
- Sample health articles
- Sample emergency contacts

Run with: python seed.py
"""
from app.core.security import hash_password
from app.db.database import Base, SessionLocal, engine
from app.models.records import FAQ, EmergencyContact, HealthArticle
from app.models.user import Doctor, User, UserRole

Base.metadata.create_all(bind=engine)
db = SessionLocal()

try:
    if not db.query(User).filter(User.email == "admin@vha-health.example").first():
        admin = User(
            full_name="System Admin",
            email="admin@vha-health.example",
            hashed_password=hash_password("Admin@123"),
            role=UserRole.admin,
            preferred_language="en",
        )
        db.add(admin)

    if db.query(Doctor).count() == 0:
        db.add_all([
            Doctor(
                full_name="Dr. Anjali Sharma",
                specialization="General Physician",
                hospital_name="Community Health Centre",
                phone="+91-9000000001",
                email="anjali.sharma@vha-health.example",
                years_experience=8,
                rating=4.6,
                consultation_fee=200,
                bio="Experienced general physician focused on rural primary care.",
            ),
            Doctor(
                full_name="Dr. Ramesh Verma",
                specialization="Pediatrician",
                hospital_name="District Hospital",
                phone="+91-9000000002",
                email="ramesh.verma@vha-health.example",
                years_experience=12,
                rating=4.8,
                consultation_fee=250,
                bio="Specialist in child health and vaccination programs.",
            ),
            Doctor(
                full_name="Dr. Sunita Patil",
                specialization="Gynecologist",
                hospital_name="Women & Child Care Centre",
                phone="+91-9000000003",
                email="sunita.patil@vha-health.example",
                years_experience=10,
                rating=4.7,
                consultation_fee=300,
                bio="Focused on maternal health, pregnancy guidance, and women's wellness.",
            ),
        ])

    if db.query(FAQ).count() == 0:
        db.add_all([
            FAQ(
                question="Is this chatbot able to diagnose my illness?",
                answer="No. This assistant only provides general health education and guidance. Always consult a qualified doctor for diagnosis and treatment.",
                category="General",
            ),
            FAQ(
                question="What should I do in a medical emergency?",
                answer="Call emergency services immediately (dial 108 in India) or go to the nearest hospital. Do not wait for chatbot guidance in an emergency.",
                category="Emergency",
            ),
            FAQ(
                question="How do I book a telemedicine appointment?",
                answer="Go to the Telemedicine page, choose a doctor by specialization, and select an available time slot to book your appointment.",
                category="Telemedicine",
            ),
        ])

    if db.query(HealthArticle).count() == 0:
        db.add_all([
            HealthArticle(
                title="5 Simple Habits for Better Daily Health",
                category="General",
                summary="Small daily habits that make a big difference to your health.",
                content=(
                    "Drink enough water throughout the day, eat a balanced diet with "
                    "vegetables and fruits, sleep 7-8 hours, wash your hands regularly, "
                    "and try to walk or move for at least 30 minutes a day. These simple "
                    "habits can significantly reduce your risk of many common illnesses."
                ),
            ),
            HealthArticle(
                title="Understanding Vaccination for Children",
                category="Child Health",
                summary="Why timely vaccination matters for your child's health.",
                content=(
                    "Vaccines protect children from serious diseases like measles, polio, "
                    "and tetanus. Following the recommended vaccination schedule from birth "
                    "helps build strong immunity. Visit your nearest health center for free "
                    "vaccination under government health programs."
                ),
            ),
            HealthArticle(
                title="Pregnancy Care: What to Expect",
                category="Pregnancy",
                summary="Basic guidance for a healthy pregnancy.",
                content=(
                    "Regular check-ups, a nutritious diet, adequate rest, and avoiding "
                    "smoking or alcohol are essential during pregnancy. Iron and folic "
                    "acid supplements, as prescribed by a doctor, help prevent anemia. "
                    "Always attend antenatal check-ups at your nearest health center."
                ),
            ),
        ])

    if db.query(EmergencyContact).count() == 0:
        db.add_all([
            EmergencyContact(label="National Ambulance Service", phone_number="108", region="National", description="Free ambulance service across India."),
            EmergencyContact(label="National Emergency Number", phone_number="112", region="National", description="All-in-one emergency helpline."),
            EmergencyContact(label="Women Helpline", phone_number="181", region="National", description="24/7 helpline for women in distress."),
            EmergencyContact(label="Child Helpline", phone_number="1098", region="National", description="24/7 helpline for children in need of care."),
            EmergencyContact(label="Mental Health Helpline (KIRAN)", phone_number="1800-599-0019", region="National", description="24/7 toll-free mental health support."),
        ])

    db.commit()
    print("Database seeded successfully.")
    print("Admin login -> email: admin@vha-health.example | password: Admin@123")
finally:
    db.close()
