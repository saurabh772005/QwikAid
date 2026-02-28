import os
import json

PREDEFINED_RESPONSES = {
    "fever": "### Home Care for Fever\n\n1. **Rest**: Get plenty of sleep to help your body recover.\n2. **Hydration**: Drink plenty of fluids like water, clear broths, or sports drinks.\n3. **Cooling**: Apply a cool, damp cloth to your forehead.\n\n> *For minor issues only. Seek medical help if symptoms worsen or fever exceeds 103°F (39.4°C).* \n",
    "pain": "### Managing Body Pain\n\n1. **Rest the affected area**: Avoid strenuous activities.\n2. **Hot/Cold Compress**: Apply an ice pack or a warm heating pad for 15-20 minutes.\n3. **Gentle Stretching**: Light stretching may relieve muscle tension.\n\n> *For minor issues only. Seek medical help if pain is severe or persists.* \n",
    "headache": "### Relief for Minor Headache\n\n1. **Hydrate**: Drink a glass of water.\n2. **Rest in a quiet, dark room**: Reduce sensory input.\n3. **Relaxation**: Try deep breathing or a gentle neck massage.\n\n> *For minor issues only. Seek medical help if headache is sudden and severe.* \n",
    "burn": "### First Aid for Minor Burns\n\n1. **Cool the burn**: Hold under cool (not cold) running water for 10-15 minutes.\n2. **Cover**: Loosely cover with a sterile, non-fluffy dressing or cloth.\n3. **Do not pop blisters**: Leave them intact to prevent infection.\n\n> *For minor issues only. Seek immediate help for large, deep, or chemical burns.* \n",
    "cut": "### Treating Small Cuts\n\n1. **Clean**: Wash your hands, then gently clean the cut with water.\n2. **Stop bleeding**: Apply gentle pressure with a clean cloth.\n3. **Bandage**: Apply a sterile adhesive bandage.\n\n> *For minor issues only. Seek medical help if the cut is deep or won't stop bleeding.* \n",
    "stomach": "### Easing Mild Stomach Ache\n\n1. **Clear fluids**: Sip water or clear broths slowly.\n2. **Brat Diet**: Try eating Bananas, Rice, Applesauce, and Toast if hungry.\n3. **Rest**: Lie down and place a warm water bottle on your stomach.\n\n> *For minor issues only. Seek medical help if pain is severe or accompanied by vomiting.* \n",
    "cold": "### Mild Cold Remedies\n\n1. **Rest and Hydrate**: Drink warm liquids like tea or soup.\n2. **Humidifier**: Use a humidifier to add moisture to the air.\n3. **Salt water gargle**: Gargle with warm salt water for a sore throat.\n\n> *For minor issues only. Seek medical help if symptoms worsen.* \n"
}

CRITICAL_KEYWORDS = ["chest", "unconscious", "bleeding", "stroke", "seizure", "breathing", "heart attack", "trauma", "poison"]

def get_chat_response(message: str) -> dict:
    msg_lower = message.lower()
    
    # 1. Check for critical keywords first
    for keyword in CRITICAL_KEYWORDS:
        if keyword in msg_lower:
            return {
                "reply": "### ⚠️ CRITICAL WARNING\n\n**This may be serious.** Please trigger the **Emergency protocol** immediately.",
                "severity_level": "critical"
            }
            
    # 2. Check for predefined minor issues
    for keyword, response in PREDEFINED_RESPONSES.items():
        if keyword in msg_lower:
            return {
                "reply": response,
                "severity_level": "minor"
            }
            
    # 3. Default fallback
    return {
        "reply": "I can provide general advice for simple issues like **fever, body pain, headache, minor cuts, or a cold**. \n\n*If you are experiencing a severe issue, please use the Emergency button.*",
        "severity_level": "minor"
    }
