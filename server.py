import os
import time
import html
import requests
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

# ── Rate limiting (simple in-memory, per IP) ─────────────────────────────────
_rate_store: dict[str, list[float]] = {}
RATE_LIMIT = 5        # max requests
RATE_WINDOW = 60      # per N seconds

def _is_rate_limited(ip: str) -> bool:
    now = time.time()
    window_start = now - RATE_WINDOW
    hits = _rate_store.get(ip, [])
    hits = [t for t in hits if t > window_start]
    if len(hits) >= RATE_LIMIT:
        _rate_store[ip] = hits
        return True
    hits.append(now)
    _rate_store[ip] = hits
    return False

# ── Security headers ─────────────────────────────────────────────────────────
@app.after_request
def set_security_headers(response):
    response.headers.pop('X-Frame-Options', None)
    response.headers['Content-Security-Policy'] = "frame-ancestors *"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response

# ── Config ───────────────────────────────────────────────────────────────────
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID', '-5107261708')

OBJECT_TYPES = {
    'private':      'Частный дом / коттедж',
    'minihotel':    'Мини-отель (9–20 номеров)',
    'hotel':        'Гостиница / апарт-отель',
    'commercial':   'Коммерческое здание / офис',
    'construction': 'Жилой комплекс / застройщик',
    'retrofit':     'Дооснащение существующей системы',
}

MAX_NAME_LEN  = 100
MAX_PHONE_LEN = 30

# ── Telegram helper ──────────────────────────────────────────────────────────
def send_telegram(text: str) -> bool:
    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    if not token:
        return False
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': 'HTML',
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        return resp.ok
    except requests.RequestException:
        return False

# ── API ──────────────────────────────────────────────────────────────────────
@app.route('/api/submit', methods=['POST'])
def submit():
    ip = request.headers.get('X-Forwarded-For', request.remote_addr or '').split(',')[0].strip()
    if _is_rate_limited(ip):
        return jsonify({'ok': False, 'error': 'Слишком много запросов. Попробуйте позже.'}), 429

    data = request.get_json(force=True, silent=True) or {}
    name     = data.get('name', '').strip()[:MAX_NAME_LEN]
    phone    = data.get('phone', '').strip()[:MAX_PHONE_LEN]
    obj_type = data.get('type', '').strip()

    if not name or not phone:
        return jsonify({'ok': False, 'error': 'Заполните имя и телефон'}), 400

    # Escape HTML to prevent injection into Telegram HTML-formatted message
    safe_name  = html.escape(name)
    safe_phone = html.escape(phone)
    obj_label  = html.escape(OBJECT_TYPES.get(obj_type, obj_type or 'Не указан'))

    text = (
        '🏠 <b>Новая заявка — Logic Smart House</b>\n\n'
        f'👤 <b>Имя:</b> {safe_name}\n'
        f'📞 <b>Телефон:</b> {safe_phone}\n'
        f'🏗 <b>Тип объекта:</b> {obj_label}'
    )

    if send_telegram(text):
        return jsonify({'ok': True})
    return jsonify({'ok': False, 'error': 'Ошибка отправки. Пожалуйста, позвоните нам напрямую.'}), 500

# ── Static file serving ──────────────────────────────────────────────────────
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join('.', path)):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
